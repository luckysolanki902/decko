# Phase 11: Real-Time Systems with Socket.io (Days 118–124)

**⏱ Duration:** 7 days · ~30 hours
**🎯 Goal:** Move past request/response. Build the real-time layer behind chat, group chat, presence, typing, and live collaboration — then scale it horizontally the way production apps do.

---

## Day 118 — WebSockets & Socket.io fundamentals
- Why request/response can't push; polling vs long-polling vs WebSockets
- The WebSocket protocol + the HTTP Upgrade handshake (101), ws:// vs wss://
- Socket.io vs raw ws — what the abstraction buys and costs
- First server + client: connection lifecycle, emit/on, CORS for the handshake
- Acknowledgements (request/response over sockets)
- **Ship:** a live notification bell

## Day 119 — Rooms, namespaces & broadcasting
- Rooms as the core targeting primitive (join/leave; per-user, per-resource)
- Broadcast patterns: socket.emit vs io.to vs socket.to vs io.emit (avoiding echo bugs)
- Namespaces vs rooms — when each fits
- Presence basics (a user has many sockets/tabs)
- Disconnect & cleanup (mark offline only on the last socket)

## Day 120 — Authentication & reliability
- Token auth in the handshake; io.use middleware to verify the JWT
- Authorization per event/room (never trust client userId)
- Reconnection & the client lifecycle; re-joining rooms after a drop
- Delivery guarantees (at-most-once), connectionStateRecovery, persist-then-emit
- Error handling in socket handlers

## Day 121 — Build a 1:1 chat
- Conversation + Message schema; one room per conversation; indexes for history
- Send → persist → deliver; optimistic UI with ack reconciliation
- Delivery & read receipts (sent → delivered → read)
- Typing indicators (throttled) & presence
- Unread counts + paginated history

## Day 122 — Group chats
- Groups & membership (members/admins); a room per group
- Fan-out to many members; offline members still need persistence
- Per-room unread, @mentions, last-read pointers
- Member presence & typing aggregation; join/leave system messages
- Cursor-based history pagination; edit/delete broadcasts

## Day 123 — Live collaboration beyond chat
- The collaboration model: shared state + presence
- Live cursors & selections (throttled, interpolated, cleaned up)
- Syncing shared document state (granular changes, debounce, reconcile)
- Conflicts: last-write-wins vs OT/CRDT (Yjs) — trade-offs, not implementation
- **Build:** a live collaborative board (sticky notes + cursors + presence)

## Day 124 — Live Emergency Drill Map
- Why one Node process isn't enough (in-memory rooms/presence break)
- The Redis adapter from scratch (pub/sub bus across instances)
- Sticky sessions & load balancing; WebSocket upgrade through a proxy
- Managed real-time (Pusher/Ably) — buy vs build
- **Project:** deploy an authorized drill map with zone status, timestamped incidents, acknowledgements, reconnect recovery, presence, and Redis-backed horizontal scale

---

## ✅ Phase 11 Capstone
**Live Emergency Drill Map** — authenticated rooms, role-scoped events, zone presence, delivery acknowledgement, reconnect recovery, incident export, Redis adapter, and a multi-browser deployed demonstration.

> _Next: Testing — make the codebase one a team will merge._
