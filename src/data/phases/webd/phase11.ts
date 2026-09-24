import { Phase } from '@/types';

export const phase11: Phase = {
  id: 'phase11',
  number: 11,
  title: 'Real-Time Systems with Socket.io',
  subtitle: 'WebSockets, chats, group chats, and live collaboration — built and scaled',
  duration: '7 Days | ~30 Hours',
  days: 'Days 118-124',
  goal: 'Move past request/response. Build the real-time layer that powers chat, group chat, presence, typing indicators, and live collaboration — then scale it horizontally the way production apps do.',
  icon: '⚡',
  color: 'violet',
  sections: [
    {
      id: 'day118',
      title: 'Day 118: WebSockets & Socket.io Fundamentals',
      duration: '4 hours',
      topics: [
        {
          id: 'why-realtime',
          title: 'Why request/response is not enough',
          duration: '35 mins',
          items: [
            'The core problem: HTTP is client-initiated — the server cannot "push"',
            'Polling vs long-polling vs WebSockets — latency and cost trade-offs',
            'Real features that need a live channel: chat, notifications, presence, live dashboards',
            'When you should NOT reach for WebSockets (simple CRUD, infrequent updates)',
          ],
        },
        {
          id: 'ws-protocol',
          title: 'The WebSocket protocol & upgrade handshake',
          duration: '45 mins',
          items: [
            'One TCP connection, kept open, full-duplex (both sides send anytime)',
            'The HTTP Upgrade handshake: 101 Switching Protocols',
            'ws:// vs wss:// (TLS) — why wss in production',
            'Frames, not requests — no headers per message',
            'What the browser gives you: the native WebSocket API (and its rough edges)',
          ],
        },
        {
          id: 'socketio-vs-ws',
          title: 'Socket.io vs raw ws',
          duration: '30 mins',
          items: [
            'What Socket.io adds: auto-reconnect, fallbacks, rooms, acks, namespaces',
            'The trade-off: it is NOT raw WebSocket (custom protocol, needs its client)',
            'When raw ws is the right call (tiny footprint, non-JS clients)',
            'Install: socket.io (server) + socket.io-client (browser)',
          ],
        },
        {
          id: 'first-server',
          title: 'Your first Socket.io server + client',
          duration: '50 mins',
          items: [
            'Attach io to an existing HTTP/Express server',
            'io.on("connection", socket => ...) — the connection lifecycle',
            'socket.emit / socket.on — sending and receiving named events',
            'Client: io(url), socket.on("connect"), socket.emit',
            'CORS config for the handshake (the #1 beginner blocker)',
          ],
        },
        {
          id: 'acks',
          title: 'Acknowledgements (request/response over sockets)',
          duration: '30 mins',
          items: [
            'Callback acks: emit with a function, server calls it back',
            'Timeouts on acks — do not wait forever',
            'When acks beat fire-and-forget (did the message actually save?)',
          ],
        },
        {
          id: 'build-105',
          title: 'Ship: live notification bell',
          duration: '40 mins',
          items: [
            'Server pushes a "notification" event to connected clients',
            'Client renders a toast + increments an unread badge',
            'Deploy check: open two tabs, trigger from one, see it in both',
          ],
          project: {
            title: 'Harbor Berth Alert',
            description: 'A minimal real-time build shipped on day one: a dispatcher changes a berth assignment, subscribed browsers react instantly, and the learner proves the round-trip before rooms and auth.',
            type: 'mini',
          },
        },
      ],
    },
    {
      id: 'day119',
      title: 'Day 119: Rooms, Namespaces & Broadcasting',
      duration: '4 hours',
      topics: [
        {
          id: 'rooms',
          title: 'Rooms — the core targeting primitive',
          duration: '50 mins',
          items: [
            'socket.join(room) / socket.leave(room)',
            'A room is just a label — a socket can be in many',
            'Per-user room (user:123) for targeted pushes',
            'Per-resource room (doc:abc, chat:xyz) for shared updates',
          ],
        },
        {
          id: 'broadcasting',
          title: 'Broadcasting patterns',
          duration: '50 mins',
          items: [
            'socket.emit — only this socket',
            'io.to(room).emit — everyone in a room (including sender)',
            'socket.to(room).emit — everyone in a room EXCEPT sender',
            'io.emit — every connected client (use sparingly)',
            'Choosing the right target to avoid echo/double-render bugs',
          ],
        },
        {
          id: 'namespaces',
          title: 'Namespaces',
          duration: '40 mins',
          items: [
            'io.of("/chat") vs io.of("/admin") — logical separation on one connection',
            'Namespaces vs rooms — when each is the right tool',
            'Middleware per namespace',
          ],
        },
        {
          id: 'presence',
          title: 'Presence basics (who is online)',
          duration: '40 mins',
          items: [
            'Track online users in memory (Map of userId → socketIds)',
            'A user can have multiple sockets (tabs/devices)',
            'Emit presence changes to interested rooms',
          ],
        },
        {
          id: 'disconnect',
          title: 'Disconnect & cleanup',
          duration: '40 mins',
          items: [
            'The "disconnect" event and its reasons',
            'Remove the socket from presence maps',
            'Only mark a user offline when their LAST socket leaves',
          ],
        },
      ],
    },
    {
      id: 'day120',
      title: 'Day 120: Authentication & Reliability',
      duration: '4 hours',
      topics: [
        {
          id: 'auth-handshake',
          title: 'Authenticating the socket',
          duration: '55 mins',
          items: [
            'Pass a token in the handshake auth payload (not a query string)',
            'io.use(middleware) — verify the JWT on connect, attach the user',
            'Reject unauthenticated connections early',
            'Why cookies + WebSockets need CORS credentials configured',
          ],
        },
        {
          id: 'authz',
          title: 'Authorization per event',
          duration: '40 mins',
          items: [
            'Verify the user may join THIS room before socket.join',
            'Never trust client-supplied userId — read it from the verified token',
            'Guarding emit handlers (can this user post to this chat?)',
          ],
        },
        {
          id: 'reconnection',
          title: 'Reconnection & the client lifecycle',
          duration: '40 mins',
          items: [
            'Auto-reconnect with backoff (built in) — and how to observe it',
            'connect / disconnect / reconnect events on the client',
            'Re-joining rooms after a reconnect (state is not automatic)',
          ],
        },
        {
          id: 'delivery',
          title: 'Delivery guarantees & error handling',
          duration: '45 mins',
          items: [
            'At-most-once by default — messages can be lost on a drop',
            'connectionStateRecovery for short disconnects',
            'Persist first, then emit — DB is the source of truth',
            'socket.on("error") and server-side try/catch in handlers',
          ],
        },
      ],
    },
    {
      id: 'day121',
      title: 'Day 121: Build a 1:1 Chat',
      duration: '5 hours',
      topics: [
        {
          id: 'schema',
          title: 'Message & conversation schema',
          duration: '50 mins',
          items: [
            'Conversation (participants[]) + Message (from, to, body, status, createdAt)',
            'One room per conversation (conv:<id>)',
            'Indexes for fast history queries (conversation + createdAt)',
          ],
        },
        {
          id: 'send-receive',
          title: 'Send, persist, deliver',
          duration: '60 mins',
          items: [
            'Client emits "message:send" with an ack',
            'Server validates → saves to Mongo → emits "message:new" to the room',
            'Optimistic UI: render locally, reconcile on ack (temp id → real id)',
          ],
        },
        {
          id: 'receipts',
          title: 'Delivery & read receipts',
          duration: '55 mins',
          items: [
            'States: sent → delivered → read',
            'Emit "message:delivered" when recipient socket receives it',
            'Emit "message:read" when the conversation is open/visible',
            'Update status in DB and broadcast the change',
          ],
        },
        {
          id: 'typing-presence',
          title: 'Typing indicators & presence',
          duration: '45 mins',
          items: [
            'Throttled "typing:start" / "typing:stop" (do not spam on every keypress)',
            'Show "online" / "last seen" from the presence layer',
            'Clean up typing state on disconnect',
          ],
        },
        {
          id: 'unread',
          title: 'Unread counts & history',
          duration: '40 mins',
          items: [
            'Per-conversation unread counter',
            'Paginated history load (cursor by createdAt/_id)',
            'Mark-as-read clears the badge and emits a receipt',
          ],
        },
      ],
    },
    {
      id: 'day122',
      title: 'Day 122: Group Chats',
      duration: '5 hours',
      topics: [
        {
          id: 'membership',
          title: 'Groups & membership model',
          duration: '50 mins',
          items: [
            'Group (name, members[], admins[]) — a room per group',
            'Join/leave changes membership AND socket rooms',
            'Roles: admin vs member (who can add/remove/rename)',
          ],
        },
        {
          id: 'fanout',
          title: 'Fan-out to many members',
          duration: '50 mins',
          items: [
            'io.to(group:<id>).emit for one write → many readers',
            'Members offline now must still see it later (persist!)',
            'Cost of fan-out as groups grow — where queues/Redis come in later',
          ],
        },
        {
          id: 'per-room-unread',
          title: 'Per-room unread & mentions',
          duration: '50 mins',
          items: [
            'Unread count per group per user',
            '@mentions create a stronger notification',
            'Last-read pointer per member',
          ],
        },
        {
          id: 'group-presence',
          title: 'Member presence & typing in groups',
          duration: '40 mins',
          items: [
            'Who is online in this group',
            '"X and Y are typing…" aggregation',
            'Join/leave system messages',
          ],
        },
        {
          id: 'history-pagination',
          title: 'History pagination at scale',
          duration: '40 mins',
          items: [
            'Cursor-based infinite scroll (never OFFSET on chat)',
            'Loading older messages without losing scroll position',
            'Deleting/editing messages and broadcasting the change',
          ],
        },
      ],
    },
    {
      id: 'day123',
      title: 'Day 123: Live Collaboration Beyond Chat',
      duration: '5 hours',
      topics: [
        {
          id: 'collab-model',
          title: 'The collaboration mental model',
          duration: '45 mins',
          items: [
            'Shared state + presence, not just messages',
            'Live cursors, selections, and "who is here" avatars',
            'Examples: Figma, Google Docs, Notion, a shared whiteboard',
          ],
        },
        {
          id: 'cursors',
          title: 'Live cursors & selections',
          duration: '55 mins',
          items: [
            'Emit cursor position (throttled to ~20-30/sec max)',
            'Render other users\' cursors with name + color',
            'Interpolate for smoothness; drop stale cursors on disconnect',
          ],
        },
        {
          id: 'shared-state',
          title: 'Syncing shared document state',
          duration: '60 mins',
          items: [
            'Broadcast granular changes, not the whole document',
            'Debounce/throttle high-frequency edits',
            'Optimistic local apply → broadcast → reconcile',
          ],
        },
        {
          id: 'conflicts',
          title: 'Conflicts: last-write-wins vs CRDT/OT',
          duration: '50 mins',
          items: [
            'Why two edits at once corrupt naive state',
            'Last-write-wins: simple, lossy — when it is acceptable',
            'What OT and CRDTs solve (Yjs) — named, not implemented here',
            'Choosing the simplest model your feature can tolerate',
          ],
        },
        {
          id: 'build-collab',
          title: 'Build: a live collaborative board',
          duration: '40 mins',
          items: [
            'Shared sticky-notes / cursors board in a room',
            'Presence avatars + live cursors',
            'Last-write-wins on note text for now',
          ],
          project: {
            title: 'Wildfire Resource Map',
            description: 'A shared real-time map where coordinators place resource markers, see presence/cursors, and reconcile last-write-wins status updates—proving collaboration patterns beyond chat.',
            type: 'mini',
          },
        },
      ],
    },
    {
      id: 'day124',
      title: 'Day 124: Project — Live Emergency Drill Map',
      duration: '5 hours',
      topics: [
        {
          id: 'scale-problem',
          title: 'Why one Node process is not enough',
          duration: '40 mins',
          items: [
            'In-memory rooms/presence break across multiple instances',
            'A user on server A cannot reach a user on server B',
            'Vertical limits: connections per process, memory, CPU',
          ],
        },
        {
          id: 'redis-adapter',
          title: 'The Redis adapter (from scratch)',
          duration: '55 mins',
          items: [
            'Redis pub/sub as the message bus BETWEEN instances',
            '@socket.io/redis-adapter: emits reach sockets on any node',
            'What it does NOT solve (presence still needs shared storage)',
            'Deep dive lands in the Redis & BullMQ phase',
          ],
        },
        {
          id: 'sticky',
          title: 'Sticky sessions & load balancing',
          duration: '40 mins',
          items: [
            'Why the HTTP long-poll fallback needs sticky sessions',
            'Configuring sticky sessions on Nginx / a load balancer',
            'WebSocket upgrade headers through a proxy',
          ],
        },
        {
          id: 'managed',
          title: 'Managed real-time (when to buy vs build)',
          duration: '30 mins',
          items: [
            'Pusher / Ably / Supabase Realtime — skip the ops',
            'Cost vs control trade-off',
            'Migration path: your event shapes stay the same',
          ],
        },
        {
          id: 'project',
          title: 'Build, test, and deploy the facilitation room',
          duration: '95 mins',
          items: [
            '1:1 + group chat with presence, typing, read receipts',
            'Auth in the handshake, authorization per room',
            'Redis adapter for horizontal scale (Upstash)',
            'Deploy; demo two browsers across the network',
          ],
          project: {
            title: 'Live Emergency Drill Map — DEPLOYED',
            description: 'Build a real-time drill coordinator: controllers open an exercise, wardens report zone status, observers submit timestamped incidents, authorized participants see a live map, and the controller closes and exports the drill. Use authenticated Socket.io rooms, presence, acknowledgements, rate limits, Redis scaling, and reconnect recovery.',
            type: 'capstone',
            features: ['Room roles, presence, reconnect handling, and host-controlled session states.', 'Live submissions with rate limiting and a shared board rendered from socket events.', 'Redis adapter, delivery acknowledgement, and an end-to-end multi-browser demo.'],
            hints: ['Separate durable session data from ephemeral presence.', 'Every socket event needs an authorization check, not just the initial connection.'],
          },
        },
      ],
    },
  ],
  checkpoint: {
    skills: [
      'WebSocket protocol + Socket.io: connection lifecycle, events, acks',
      'Rooms, namespaces, and correct broadcast targeting',
      'Authenticated sockets (JWT handshake) + per-room authorization',
      '1:1 chat with persistence, receipts, typing, presence, unread',
      'Group chat with membership, fan-out, and pagination',
      'Live collaboration (cursors, shared state, conflict trade-offs)',
      'Horizontal scaling with the Redis adapter + sticky sessions',
    ],
    milestone: 'You can build and scale the real-time layer behind chat and collaborative products — the feature set that separates a demo from a platform.',
  },
};
