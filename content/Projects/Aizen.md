---
title: Aizen — Universal Task Orchestrator
date: 2026-06-27
meta: ai · workflows · DAG
publish: "true"
---

# Aizen 

A pipeline shouldn't be a script. It should be a plan you can inspect, pause, resume, and rewire mid-flight.

Most automation tools treat pipelines as linear scripts. You write steps in order, run the thing, and hope nothing breaks halfway through. If it does, you fix the issue and restart from zero. That works for simple CI  but the moment your pipeline involves AI prompts, shell commands, MCP server calls, approval gates, and parallel execution, the script model falls apart.

Aizen is a DAG-based workflow engine that treats each pipeline as a directed graph of stages not a flat list. It ships with multi-AI backends, a plugin system, checkpoint/resume, variable interpolation, streaming AI output, and a CLI designed for both interactive and headless use.

The project is written in Python and lives at [github.com/J0na555/aizen](https://github.com/J0na555/aizen).

## The Shape of a Workflow

Workflows are defined as YAML. Each stage has an ID, a type, optional dependencies, and type-specific configuration. Here's the minimal form:

```yaml
name: "hello-world"
stages:
  - id: greet
    type: shell
    command: "echo Hello, World!"
```

From there it scales to complex DAGs with parallel branches, AI stages that chain output to one another, and failure strategies that decide whether to stop, continue, or retry.

A more realistic example  planning and implementing a feature using AI, then linting, testing, and deploying:

```yaml
name: "Build and deploy feature"
variables:
  feature: "dark-mode-toggle"

stages:
  - id: plan
    type: ai
    prompt: "Analyze the requirements for {{ feature }}. Create a plan."
    output: plan.md
    requires_approval: true

  - id: implement
    type: ai
    prompt: "Implement {{ feature }} following plan.md"
    depends_on: [plan]

  - id: lint
    type: shell
    command: "ruff check src/"
    depends_on: [implement]
    on_fail: continue

  - id: test
    type: shell
    command: "pytest tests/ -v"
    depends_on: [implement]
    on_fail: retry
    max_retries: 2

  - id: deploy
    type: shell
    command: "git push && gh workflow run deploy.yml"
    depends_on: [lint, test]
    requires_approval: true
```

The engine resolves the dependency graph into execution waves. Stages in the same wave with no interdependencies run concurrently when `--parallel` is passed. The `lint` and `test` stages above, for example, execute in parallel after `implement` completes.

## Stage Types

Aizen supports five built-in stage types, each with its own runner:

- **`shell`** — Executes a shell command and captures stdout/stderr. Supports env vars, timeouts, and cwd configuration.
- **`ai`** — Sends a prompt to an AI CLI. Backends are auto-detected from `PATH` — Claude, OpenCode, Codex, and Gemini are all supported. The engine dispatches to whichever is available, falling back through a configurable priority chain.
- **`mcp`** — Calls an MCP (Model Context Protocol) server via HTTP POST. Useful for connecting external tools, APIs, or microservices as pipeline stages.
- **`python`** — Imports a dotted Python path (`module.function`) and calls it with the stage state. For when you need programmatic logic inline.
- **`plugin`** — Runs a custom stage class installed in `~/.aizen/plugins/`. Plugins are discovered automatically, no registration needed.

## Architecture

Aizen splits state across two domains: a global config directory and per-project directories.

```
~/.aizen/
  config.yaml       # API keys, project registry
  plugins/          # Installed stage plugins

project/
  .aizen/
    config.yaml     # Per-project settings
    state.json      # Current workflow state (checkpoint)
    runs/           # Archived workflow runs
  workflows/
    feature.yaml    # Workflow definitions
```

The engine itself is a loop: inspect the DAG for ready stages, dispatch each to its runner, checkpoint state, repeat. Each successful — or failed — stage triggers a state save to `.aizen/state.json`. If you hit Ctrl+C, the engine finishes the current stage and serializes everything. Resume later with `aizen resume`, and it picks up exactly where it left off.

## The Plugin System

Plugins are Python classes that extend `BaseStage`. A plugin lives in `~/.aizen/plugins/` as either a single `.py` file or a package directory with `plugin.json` metadata.

```python
from aizen.stages.base import BaseStage

class GreeterStage(BaseStage):
    def run(self, stage, state, context=None):
        name = stage.variables.get("name", "world")
        state.output = f"Hello, {name}!"
        state.status = "COMPLETED"
        return state
```

The hook system lets plugins observe execution without becoming stages. Hook points include `before_stage`, `after_stage`, `on_failure`, `on_start`, and `on_complete`. A plugin's `register_hooks()` function is auto-detected and called on discovery.

## AI Backend Auto-Detection

Rather than hardcoding a single AI provider, Aizen scans `PATH` for available CLIs and registers whichever it finds. The registry resolves the provider name  `claude`, `opencode`, `codex`, `gemini` — to a client that wraps the CLI with `subprocess`.

Each client implements a simple interface:

```python
class AIClient:
    def run(self, prompt, model=None, context=None) -> str: ...
    def run_streaming(self, prompt, model=None, context=None) -> Generator[str]: ...
```

The streaming variant uses `subprocess.Popen` and yields lines as the AI produces them, rendered through Rich's `Live` display for a real-time terminal experience.

## Checkpoint, Resume, Rollback

This is where Aizen differentiates itself from a simple script runner.

After every stage — regardless of success or failure — the engine writes the full workflow state to disk. This means you can:

- **Pause** mid-pipeline (Ctrl+C or `aizen pause` from another terminal). The engine waits for the current stage to finish, then saves.
- **Resume** from exactly where you stopped. No re-execution of completed stages.
- **Rollback** a specific stage. `aizen rollback plan` resets `plan` and every stage that depends on it to PENDING, while leaving upstream stages intact.
- **Edit** a stage's YAML mid-run with `aizen edit plan`, which opens `$EDITOR`, validates the changes, and patches the workflow file.

This makes Aizen practical for long-running AI-heavy workflows where you want to iterate on prompts without starting over.

## Variable Interpolation

Stages can reference each other's output through `${...}` expressions. The interpolation engine resolves these at runtime, just before a stage executes:

| Expression              | Resolves To                          |
| ----------------------- | ------------------------------------ |
| `${stages.<id>.output}` | Output of another completed stage    |
| `${stages.<id>.error}`  | Error message of a failed stage      |
| `${variables.<key>}`    | A runtime variable from the workflow |
| `${stage.<field>}`      | A field on the current stage         |

This enables output chaining  pass an AI stage's generated plan directly into the prompt of a downstream implementation stage, without intermediate files.

## Testing

77 tests covering models, state management, the DAG engine, config, plugins, workflow validation, parallel execution, variable interpolation, streaming, logging, dry-run, and integration. Tests use `pytest` with `tmp_path` fixtures for isolated filesystem state.

```bash
pytest tests/ -v
```

## Key Design Decisions

Some decisions shaped the project more than others:

**YAML for workflows over GUI.** Workflow definitions should be version-controlled, diffable, and reviewable in pull requests. A GUI would add maintenance overhead without proportional value for the target audience (developers).

**Checkpoint after every stage.** Granularity is cheap when state is serializable. Writing after every stage makes pause/resume trivial and loses at most one stage of progress on crash.

**Plugin auto-discovery.** Scanning `~/.aizen/plugins/` for `BaseStage` subclasses removes friction. No central plugin registry, no manual `pip install` steps for simple stages.

**AI backends as CLI wrappers.** Rather than calling APIs directly (which would require API keys in config and SDK dependencies per provider), Aizen shells out to whatever AI CLI the user already has installed. This keeps the dependency footprint small and leverages the user's existing auth setup.

**Thread-based parallelism, not async.** Python's `ThreadPoolExecutor` with a `threading.Lock` for shared state is simple, debuggable, and sufficient for I/O-bound stages. Async would add complexity without meaningful throughput gains for this workload pattern.

## What's Next

The v2 plan includes UI mode (terminal dashboard or TUI), dynamic stage injection (add stages mid-run based on AI output), conditional branching (if/then/else in workflows), and a workflow editor (visual DAG builder). The plugin system also opens the door for community-contributed integrations — Slack notifiers, Jira ticket creators, database migration runners.

---

Aizen is open source. The code, documentation, and all 77 passing tests are at [github.com/J0na555/aizen](https://github.com/J0na555/aizen).


### additional features for aizen
- what if we pivot to code reviewer or not pivot but add feature that reviews code for each push or pr 
	- those projects can be flagged in some way 
	- the review can go like this one model writes and another reviews before merge and if its not that high it will hand it back to the coder and the coder will take the review  (loop lol)

- i dont like that much that its yaml type format so might about that as well, its not becoming intuitive foe me 
- also the usage is not clear enough i think cause when  try to use this workflow in a project the model is telling me not to use this workflow for some reason