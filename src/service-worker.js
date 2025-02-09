import { build, files, version } from '$service-worker';

// SOURCE writeStream: https://github.com/jimmywarting/native-file-system-adapter/blob/master/example/sw.js
// SOURCE caching: https://kit.svelte.dev/docs/service-workers
// both blatantly copied and pasted because I dislike working with service workers

const CACHE = `cache-${version}`;
const FONTS_PATH = '/fonts';
const ASSETS = [...build, ...files];

// Want to remove this postMessage hack, tell them u want transferable streams:
// https://bugs.webkit.org/show_bug.cgi?id=215485

/** @implements {UnderlyingSource} */
class MessagePortSource {
	/** @type {ReadableStreamController<any>} controller */
	controller;

	/** @param {MessagePort} port */
	constructor(port) {
		this.port = port;
		this.port.onmessage = (evt) => this.onMessage(evt.data);
	}

	/**
	 * @param {ReadableStreamController<any>} controller
	 */
	start(controller) {
		this.controller = controller;
	}

	pull() {
		this.port.postMessage({ type: 0 });
	}

	/** @param {Error} reason */
	cancel(reason) {
		// Firefox can notify a cancel event, chrome can't
		// https://bugs.chromium.org/p/chromium/issues/detail?id=638494
		this.port.postMessage({ type: 1, reason: reason.message });
		this.port.close();
	}

	/** @param {{ type: number; chunk: Uint8Array; reason: any; }} message */
	onMessage(message) {
		// enqueue() will call pull() if needed when there's no backpressure
		if (message.type === 0) {
			this.controller.enqueue(message.chunk);
		}
		if (message.type === 1) {
			this.controller.error(message.reason);
			this.port.close();
		}
		if (message.type === 2) {
			this.controller.close();
			this.port.close();
		}
	}
}

self.addEventListener('install', (event) => {
	self.skipWaiting();

	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());

	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

const map = new Map();

// This should be called once per download
// Each event has a dataChannel that the data will be piped through
globalThis.addEventListener('message', (evt) => {
	const data = evt.data;
	if (data.url && data.readablePort) {
		data.rs = new ReadableStream(
			new MessagePortSource(evt.data.readablePort),
			new CountQueuingStrategy({ highWaterMark: 4 }),
		);
		map.set(data.url, data);
	}
});

globalThis.addEventListener('fetch', (evt) => {
	const url = evt.request.url;
	const data = map.get(url);
	if (!data) return null;
	map.delete(url);
	evt.respondWith(
		new Response(data.rs, {
			headers: data.headers,
		}),
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		if (ASSETS.includes(url.pathname) || url.pathname.startsWith(FONTS_PATH)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		try {
			const response = await fetch(event.request);

			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			throw err;
		}
	}

	event.respondWith(respond());
});
