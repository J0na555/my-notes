'use strict';

const { Plugin, ItemView, PluginSettingTab, Setting, Notice, TFile, debounce } = require('obsidian');
const os = require('os');

const VIEW_TYPE = 'comments-with-notification-panel';

// ── Comment parsing ───────────────────────────────────────────────────────────
// Comment format in the markdown file:
//
//   > [!comment] @creator → #member/name1 #member/name2
//   > <!-- ts:1717123456789 -->
//   > <!-- username:read -->
//   > Comment content here.
//
// The title line encodes creator and tagged users.
// The timestamp and read receipts are stored as HTML comments (invisible in
// rendered view).

function parseComments(filePath, content) {
  const comments = [];
  const lines    = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const titleMatch = lines[i].match(/^>\s*\[!comment\]\s*(.*)/);
    if (!titleMatch) { i++; continue; }

    const title        = titleMatch[1].trim();
    const creatorMatch = title.match(/@(\S+)/);
    const creator      = creatorMatch ? creatorMatch[1] : '?';

    const memberTags = [];
    const tagRe = /#member\/(\S+)/g;
    let tm;
    while ((tm = tagRe.exec(title)) !== null) memberTags.push(tm[1]);

    // Collect callout body (lines starting with >)
    let ts = 0;
    const readBy    = [];
    const bodyLines = [];
    let j = i + 1;
    while (j < lines.length && /^>/.test(lines[j])) {
      const body      = lines[j].replace(/^>\s?/, '');
      const tsMatch   = body.match(/^<!--\s*ts:(\d+)\s*-->/);
      const readMatch = body.match(/^<!--\s*(\S+):read\s*-->/);
      if (tsMatch)        { ts = parseInt(tsMatch[1], 10); }
      else if (readMatch) { readBy.push(readMatch[1]); }
      else                { bodyLines.push(body); }
      j++;
    }

    comments.push({
      filePath,
      lineFrom: i,
      lineTo:   j - 1,
      creator,
      memberTags,
      ts,
      readBy,
      preview: bodyLines.filter(l => l.trim()).join(' ').slice(0, 120),
    });
    i = j;
  }
  return comments;
}

// ── Notification panel ────────────────────────────────────────────────────────

class CommentsPanel extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType()    { return VIEW_TYPE; }
  getDisplayText() { return 'Comments with Notification'; }
  getIcon()        { return 'bell'; }

  async onOpen() { await this.render(); }

  async render() {
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass('cwn-panel');

    const username = this.plugin.getUsername();
    if (!username) {
      root.createEl('p', {
        text: 'Set your username in Settings → Community Plugins → Comments with Notification.',
        cls: 'cwn-notice',
      });
      return;
    }

    const subscribed = this.plugin.getSubscribedTags();
    const comments   = await this.plugin.scanComments();
    const unread     = comments
      .filter(c => isUnread(c, subscribed))
      .sort((a, b) => b.ts - a.ts);

    // ── Header ──
    const header = root.createDiv({ cls: 'cwn-header' });
    header.createEl('span', {
      text: unread.length ? `${unread.length} unread` : 'No unread comments',
      cls: 'cwn-count',
    });

    const markBtn = header.createEl('button', { text: 'Mark all as read', cls: 'cwn-btn' });
    markBtn.addEventListener('click', async () => {
      await this.plugin.markAsRead();
      await this.render();
    });

    const refreshBtn = header.createEl('button', { text: '↻', cls: 'cwn-btn cwn-refresh' });
    refreshBtn.setAttribute('aria-label', 'Refresh');
    refreshBtn.addEventListener('click', () => this.render());

    if (!unread.length) return;

    // ── Comment list ──
    const list = root.createDiv({ cls: 'cwn-list' });
    for (const c of unread) {
      const item = list.createDiv({ cls: 'cwn-item' });

      const meta = item.createDiv({ cls: 'cwn-meta' });
      meta.createEl('span', { text: `@${c.creator}`, cls: 'cwn-creator' });
      meta.createEl('span', { text: new Date(c.ts).toLocaleString(), cls: 'cwn-ts' });
      meta.createEl('span', {
        text: c.filePath.split('/').pop().replace(/\.md$/, ''),
        cls: 'cwn-file',
      });

      if (c.preview) {
        item.createEl('p', {
          text: c.preview + (c.preview.length >= 120 ? '…' : ''),
          cls: 'cwn-preview',
        });
      }

      item.addEventListener('click', async () => {
        await this.plugin.markCommentAsRead(c);
        await this.plugin.navigateTo(c);
        await this.render();
        await this.plugin.updateBadge();
      });
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isUnread(comment, subscribed) {
  return comment.memberTags.some(t => subscribed.includes(t)) &&
         !subscribed.some(s => comment.readBy.includes(s));
}

// ── Settings tab ──────────────────────────────────────────────────────────────

class CommentsWithNotificationSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Your username')
      .setDesc(
        `Identifies you on this machine (${this.plugin.hostname}). ` +
        'Use the same name others will type after #member/.'
      )
      .addText(text => text
        .setPlaceholder('e.g. mkali')
        .setValue(this.plugin.getUsername() || '')
        .onChange(async value => {
          this.plugin.data.users[this.plugin.hostname] = value.trim();
          await this.plugin.persistData();
        })
      );

    new Setting(containerEl)
      .setName('Additional tags to follow')
      .setDesc(
        'Comma-separated list of extra #member/ tags to monitor on this machine ' +
        '(e.g. physics-team, lab-members). Leave blank to follow only your username.'
      )
      .addText(text => text
        .setPlaceholder('e.g. physics-team, lab-members')
        .setValue((this.plugin.data.extraTags?.[this.plugin.hostname] || []).join(', '))
        .onChange(async value => {
          if (!this.plugin.data.extraTags) this.plugin.data.extraTags = {};
          this.plugin.data.extraTags[this.plugin.hostname] = value
            .split(',')
            .map(t => t.trim().replace(/^#member\//, '').replace(/^#/, ''))
            .filter(Boolean);
          await this.plugin.persistData();
        })
      );
  }
}

// ── Plugin ────────────────────────────────────────────────────────────────────

class CommentsWithNotificationPlugin extends Plugin {
  async onload() {
    this.hostname = os.hostname();
    this.data     = await this.loadData() || { users: {}, extraTags: {} };
    this._cache   = new Map(); // filePath → { mtime, comments }

    this._refreshPanel = debounce(async () => {
      const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
      if (leaves.length) await leaves[0].view.render();
      await this.updateBadge();
    }, 2000, true);

    this.registerView(VIEW_TYPE, leaf => new CommentsPanel(leaf, this));

    this.ribbonIcon = this.addRibbonIcon('bell', 'Comments with Notification', () => this.openPanel());
    this.ribbonIcon.addClass('cwn-ribbon');
    this.app.workspace.onLayoutReady(() => this.updateBadge());

    this.addCommand({
      id:   'comments-with-notification-insert',
      name: 'Insert Comment',
      editorCallback: editor => this.insertComment(editor),
    });

    this.addCommand({
      id:   'comments-with-notification-mark-read',
      name: 'Mark All Comments as Read',
      callback: async () => {
        await this.markAsRead();
        new Notice('All comments marked as read.');
        this._refreshPanel();
      },
    });

    this.addSettingTab(new CommentsWithNotificationSettingTab(this.app, this));

    this.registerEvent(
      this.app.workspace.on('editor-menu', (menu, editor) => {
        menu.addItem(item => item
          .setTitle('Insert Comment')
          .setIcon('message-circle')
          .onClick(() => this.insertComment(editor))
        );
      })
    );

    // Invalidate cache and refresh panel when files change (e.g. Dropbox sync)
    this.registerEvent(this.app.vault.on('modify', file => {
      this._cache.delete(file.path);
      this._refreshPanel();
    }));
    this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
      this._cache.delete(oldPath);
    }));
    this.registerEvent(this.app.vault.on('delete', file => {
      this._cache.delete(file.path);
    }));
  }

  getUsername()      { return this.data.users[this.hostname] || null; }
  getSubscribedTags() {
    const username = this.getUsername();
    const extra    = this.data.extraTags?.[this.hostname] || [];
    return username ? [username, ...extra] : extra;
  }

  async persistData() { await this.saveData(this.data); }

  // Insert <!-- username:read --> after the <!-- ts:... --> line of a comment.
  _findInsertLine(lines, lineFrom) {
    for (let j = lineFrom + 1; j < lines.length; j++) {
      if (!/^>/.test(lines[j])) break;
      if (/^>\s*<!--\s*ts:\d+\s*-->/.test(lines[j])) return j + 1;
    }
    return lineFrom + 1;
  }

  async markCommentAsRead(comment) {
    const username = this.getUsername();
    if (!username || comment.readBy.includes(username)) return;
    const file = this.app.vault.getAbstractFileByPath(comment.filePath);
    if (!(file instanceof TFile)) return;
    const content = await this.app.vault.read(file);
    const lines   = content.split('\n');
    lines.splice(this._findInsertLine(lines, comment.lineFrom), 0, `> <!-- ${username}:read -->`);
    this._cache.delete(comment.filePath);
    await this.app.vault.modify(file, lines.join('\n'));
  }

  async markAsRead() {
    const subscribed = this.getSubscribedTags();
    const username   = this.getUsername();
    if (!username || !subscribed.length) return;

    const comments = await this.scanComments();
    const unread   = comments.filter(c => isUnread(c, subscribed));

    // Group by file, process bottom-to-top within each file so line numbers stay valid.
    const byFile = new Map();
    for (const c of unread) {
      if (!byFile.has(c.filePath)) byFile.set(c.filePath, []);
      byFile.get(c.filePath).push(c);
    }

    for (const [filePath, fileComments] of byFile) {
      const file = this.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) continue;
      const content = await this.app.vault.read(file);
      const lines   = content.split('\n');
      fileComments.sort((a, b) => b.lineFrom - a.lineFrom);
      for (const c of fileComments) {
        lines.splice(this._findInsertLine(lines, c.lineFrom), 0, `> <!-- ${username}:read -->`);
      }
      this._cache.delete(filePath);
      await this.app.vault.modify(file, lines.join('\n'));
    }

    await this.updateBadge();
  }

  async updateBadge() {
    const subscribed = this.getSubscribedTags();
    if (!subscribed.length) { this.ribbonIcon.removeClass('has-unread'); return; }
    const comments = await this.scanComments();
    const hasUnread = comments.some(c => isUnread(c, subscribed));
    this.ribbonIcon.toggleClass('has-unread', hasUnread);
  }

  async scanComments() {
    const all = [];
    for (const file of this.app.vault.getMarkdownFiles()) {
      const cached = this._cache.get(file.path);
      if (cached && cached.mtime === file.stat.mtime) {
        all.push(...cached.comments);
        continue;
      }
      const content  = await this.app.vault.read(file);
      const comments = parseComments(file.path, content);
      this._cache.set(file.path, { mtime: file.stat.mtime, comments });
      all.push(...comments);
    }
    return all;
  }

  async openPanel() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (existing.length) {
      this.app.workspace.revealLeaf(existing[0]);
      await existing[0].view.render();
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    await leaf.setViewState({ type: VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  async navigateTo(comment) {
    const file = this.app.vault.getAbstractFileByPath(comment.filePath);
    if (!(file instanceof TFile)) return;
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
    const editor = leaf.view?.editor;
    if (editor) {
      // Scan the live editor content to find where the callout actually ends
      // (it may have grown since the comment was parsed, e.g. a :read marker
      // was just inserted). Place cursor outside so the callout renders prettily.
      let actualLineTo = comment.lineFrom;
      while (actualLineTo + 1 < editor.lineCount() &&
             /^>/.test(editor.getLine(actualLineTo + 1))) {
        actualLineTo++;
      }
      const afterCallout  = actualLineTo + 1;
      const beforeCallout = comment.lineFrom - 1;
      const target = afterCallout < editor.lineCount() ? afterCallout
                   : beforeCallout >= 0               ? beforeCallout
                   : comment.lineFrom;
      const pos = { line: target, ch: 0 };
      editor.setCursor(pos);
      editor.scrollIntoView({ from: pos, to: pos }, true);
    }
  }

  insertComment(editor) {
    const username = this.getUsername();
    if (!username) {
      new Notice('Set your username in Settings → Comments with Notification first.');
      return;
    }
    const ts        = Date.now();
    const cursor    = editor.getCursor();
    const lineText  = editor.getLine(cursor.line);
    const atStart   = lineText.slice(0, cursor.ch).trim() === '';
    const prefix    = atStart ? '' : '\n';
    // Template ends with #member (no slash) — the slash is inserted below as
    // a simulated keystroke so Obsidian opens its tag autocomplete dropdown.
    const titleLine = `> [!comment] @${username} → #member`;
    const template  = `${prefix}${titleLine}\n> <!-- ts:${ts} -->\n> `;
    editor.replaceRange(template, cursor);
    const notifyLine = cursor.line + (atStart ? 0 : 1);
    editor.setCursor({ line: notifyLine, ch: titleLine.length });

    // Dispatch "/" as a real user-input transaction so Obsidian's tag
    // autocomplete treats it as genuine typing and opens the dropdown.
    const cm = editor.cm;
    if (cm) {
      const pos = cm.state.selection.main.head;
      cm.dispatch({
        changes:   { from: pos, to: pos, insert: '/' },
        selection:  { anchor: pos + 1 },
        userEvent: 'input.type',
      });
    }
  }
}

module.exports = CommentsWithNotificationPlugin;

/* nosourcemap */