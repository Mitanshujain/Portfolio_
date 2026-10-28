const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function setup(response, supported = true) {
  const created = [], requests = [], timers = [];
  const status = { hidden: true, children: [], replaceChildren(...nodes) { this.children = nodes; } };
  const link = {
    href: 'https://portfolio.example/assets/Mitanshu-Jain-Resume.pdf',
    dataset: { statusTarget: 'feedback' },
    handlers: {}, attrs: {},
    addEventListener(k, fn) { this.handlers[k] = fn; },
    setAttribute(k, v) { this.attrs[k] = v; },
    removeAttribute(k) { delete this.attrs[k]; },
    getAttribute(k) { return k === 'download' ? 'Mitanshu-Jain-Resume.pdf' : null; }
  };
  const document = {
    getElementById(id) { return id === 'feedback' ? status : null; },
    querySelectorAll() { return [link]; },
    createTextNode(text) { return { textContent: text }; },
    createElement(tag) {
      const node = { tag, click() { this.clicked = true; }, remove() { this.removed = true; } };
      created.push(node); return node;
    },
    body: { appendChild(node) { node.appended = true; } }
  };
  const objectURLs = [];
  const URL = { createObjectURL(blob) { objectURLs.push(blob); return 'blob:resume'; }, revokeObjectURL() {} };
  const fetch = async (...args) => { requests.push(args); if (response instanceof Error) throw response; return response; };
  const window = supported ? { fetch, URL } : {};
  vm.runInNewContext(readFileSync('dist/app.js', 'utf8'), { document, window, fetch, URL, Blob, setTimeout(fn) { timers.push(fn); }, WeakSet });
  return { link, status, created, requests, objectURLs };
}

test('user click downloads the original PDF bytes and offers a viewer fallback', async () => {
  const bytes = Buffer.from('%PDF-1.7\noriginal resume bytes');
  const s = setup({ ok: true, arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) });
  assert.equal(typeof s.link.handlers.click, 'function', 'download handler must be registered');
  let prevented = false;
  await s.link.handlers.click({ preventDefault() { prevented = true; } });
  assert.ok(prevented);
  const download = s.created.find(x => x.download);
  assert.ok(download.clicked);
  assert.equal(download.download, 'Mitanshu-Jain-Resume.pdf');
  assert.deepEqual(Buffer.from(await s.objectURLs[0].arrayBuffer()), bytes);
  assert.equal(s.status.hidden, false);
  const fallback = s.status.children.find(x => x.href);
  assert.equal(fallback.href, s.link.href);
  assert.equal(fallback.target, '_blank');
  assert.equal(s.requests[0][1].credentials, 'same-origin');
  assert.equal(s.link.attrs['aria-busy'], undefined);
});

test('a failed request offers the original PDF link without downloading an error page', async () => {
  const s = setup(new Error('Request failed'));
  assert.equal(typeof s.link.handlers.click, 'function');
  await s.link.handlers.click({ preventDefault() {} });
  assert.equal(s.objectURLs.length, 0);
  assert.ok(s.status.children.find(x => x.href === s.link.href));
  assert.equal(s.link.attrs['aria-busy'], undefined);
});

test('an HTML response is rejected instead of saving it as a resume', async () => {
  const bytes = Buffer.from('<html>Authentication required</html>');
  const s = setup({ ok: true, arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) });
  assert.equal(typeof s.link.handlers.click, 'function');
  await s.link.handlers.click({ preventDefault() {} });
  assert.equal(s.objectURLs.length, 0);
  assert.ok(s.status.children.find(x => x.href === s.link.href));
});

test('unsupported browsers retain the native PDF link', () => {
  const s = setup(null, false);
  assert.equal(s.link.handlers.click, undefined);
});
