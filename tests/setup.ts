import '@testing-library/jest-dom';
import { server } from './server';

// jsdom Files need the modern Blob methods used by fetch's multipart encoder.
Blob.prototype.arrayBuffer = function () {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(this);
  });
};
Blob.prototype.stream = function () {
  return new ReadableStream({ start: async controller => { controller.enqueue(new Uint8Array(await this.arrayBuffer())); controller.close(); } });
};
Blob.prototype.text = async function () { return new TextDecoder().decode(await this.arrayBuffer()); };

Object.defineProperty(window, 'matchMedia', { writable: true, value: jest.fn().mockImplementation(query => ({
  matches: false, media: query, onchange: null, addListener: jest.fn(), removeListener: jest.fn(),
  addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn(),
})) });
window.scrollTo = jest.fn();
Element.prototype.scrollIntoView = jest.fn();
globalThis.IntersectionObserver = class {
  root = null; rootMargin = ''; thresholds = [0];
  constructor(private callback: (...args: any[]) => void) {}
  observe(target: Element) { this.callback([{ target, isIntersecting: true } as IntersectionObserverEntry], this); }
  unobserve() {} disconnect() {} takeRecords() { return []; }
};
URL.createObjectURL = jest.fn(() => 'blob:preview');
URL.revokeObjectURL = jest.fn();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => { server.resetHandlers(); localStorage.clear(); jest.clearAllMocks(); });
afterAll(() => server.close());
