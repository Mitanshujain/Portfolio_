(() => {
  const toggle = document.getElementById('menu-toggle');
  const navigation = document.getElementById('nav-links');
  if (!toggle || !navigation) return;
  const mobile = window.matchMedia('(max-width: 720px)');

  function setMenu(open, restoreFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    if (restoreFocus) toggle.focus();
  }

  document.documentElement.classList.add('js');
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false, true);
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  mobile.addEventListener('change', () => setMenu(false));
})();

(() => {
  if (!window.fetch || !window.URL || !window.URL.createObjectURL) return;
  const pending = new WeakSet();

  function showResumeFeedback(link, message) {
    const status = document.getElementById(link.dataset.statusTarget);
    if (!status) return;
    const fallback = document.createElement('a');
    fallback.href = link.href;
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    fallback.textContent = 'Open the PDF';
    status.replaceChildren(
      document.createTextNode(message + ' '),
      fallback,
      document.createTextNode(' and use the PDF viewer’s download button if needed.')
    );
    status.hidden = false;
  }

  document.querySelectorAll('[data-resume-download]').forEach(link => {
    link.addEventListener('click', async event => {
      if (event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (pending.has(link)) return;
      pending.add(link);
      link.setAttribute('aria-busy', 'true');
      try {
        const response = await window.fetch(link.href, { credentials: 'same-origin' });
        if (!response.ok) throw new Error('Resume request failed');
        const bytes = await response.arrayBuffer();
        const signature = new Uint8Array(bytes, 0, Math.min(bytes.byteLength, 5));
        if (signature.length !== 5 || ![37, 80, 68, 70, 45].every((value, index) => signature[index] === value)) {
          throw new Error('Resume response is not a PDF');
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const objectURL = window.URL.createObjectURL(blob);
        const download = document.createElement('a');
        download.href = objectURL;
        download.download = link.getAttribute('download') || 'Mitanshu-Jain-Resume.pdf';
        download.hidden = true;
        document.body.appendChild(download);
        download.click();
        download.remove();
        setTimeout(() => window.URL.revokeObjectURL(objectURL), 60000);
        showResumeFeedback(link, 'Download requested. If it hasn’t started,');
      } catch {
        showResumeFeedback(link, 'Your browser couldn’t start the download.');
      } finally {
        pending.delete(link);
        link.removeAttribute('aria-busy');
      }
    });
  });
})();
