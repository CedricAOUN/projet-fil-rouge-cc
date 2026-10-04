const { TextEncoder, TextDecoder } = require('node:util');
const { ReadableStream, TransformStream, WritableStream } = require('node:stream/web');
const { BroadcastChannel, MessagePort } = require('node:worker_threads');
Object.assign(globalThis, { TextEncoder, TextDecoder, ReadableStream, TransformStream, WritableStream, BroadcastChannel, MessagePort });
const { fetch, Headers, Request, Response, FormData } = require('undici');
Object.assign(globalThis, { fetch, Headers, Request, Response, FormData });
