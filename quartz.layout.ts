import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.Row([Component.Darkmode(), Component.Search()])],
  afterBody: [Component.GardenFX()],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/J0na555",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({
        spacerSymbol: "❯",
        rootName: "Home",
        resolveFrontmatterTitle: true,
        showCurrentPage: true,
        // leadingWindow: 1,
        // trailingWindow: 1,
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    // Left rail = navigation (mockup style). Single Explorer instance renders
    // both the desktop tree and the mobile hamburger drawer.
    Component.Explorer({
      title: "Explore",
      useSavedState: true,
    }),
  ],
  right: [
    // Right rail = graph over table-of-contents over backlinks (mockup style).
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      spacerSymbol: "❯",
      rootName: "Home",
      resolveFrontmatterTitle: true,
      showCurrentPage: true,
      // leadingWindow: 1,
      // trailingWindow: 1,
    }),
    Component.ArticleTitle(),
  ],
  left: [Component.MobileOnly(Component.Spacer())],
  right: [],
}