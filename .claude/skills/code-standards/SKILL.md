---
name: code-standards
description: Project code standards to apply when generating or modifying code.
---

# Code Standards

## Always use curly brackets for if statement bodies

Even for single-line bodies, always use curly brackets.

**Bad:**
```ts
if (status !== "connected") return;
```

**Good:**
```ts
if (status !== "connected") {
  return;
}
```

## Never use single-letter names or opaque abbreviations in function arguments

Argument names must clearly communicate what they represent. Single letters and abbreviations that don't convey meaning are not allowed. This applies to all variables and parameters, not just function arguments.

**Bad:**
```ts
function setStatus(s: ConnectionStatus) { ... }
const setTicker = (d: TickerData) => { ... }
useMarketStore.setState((s) => ({ reconnectAttempts: s.reconnectAttempts + 1 }))
const setLastMessageAt = (ts: number) => { ... }
```

**Good:**
```ts
function setStatus(status: ConnectionStatus) { ... }
const setTicker = (data: TickerData) => { ... }
useMarketStore.setState((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 }))
const setLastMessageAt = (timestamp: number) => { ... }
```
