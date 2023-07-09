// qr generator. uses qrcode.js from cdn.

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const canvas = document.getElementById('qr');
const status = document.getElementById('status');

let activeTab = 'text';

tabs.forEach(t => {
  t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    panels.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.querySelector(`.panel[data-panel="${t.dataset.tab}"]`).classList.add('active');
    activeTab = t.dataset.tab;
    render();
  });
});

function buildPayload() {
  if (activeTab === 'text') {
    return document.getElementById('text-input').value;
  }
  if (activeTab === 'url') {
    return document.getElementById('url-input').value;
  }
  return '';
}

function render() {
  const payload = buildPayload();
  if (!payload) {
    const ctx = canvas.getContext('2d');
    canvas.width = 280;
    canvas.height = 280;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    status.textContent = 'type something to generate a code';
    return;
  }
  QRCode.toCanvas(canvas, payload, {
    errorCorrectionLevel: 'M',
    width: 280,
    margin: 2,
    color: { dark: '#1c1c1c', light: '#ffffff' }
  }, err => {
    if (err) {
      status.textContent = 'error: ' + err.message;
      return;
    }
    status.textContent = `${payload.length} chars`;
  });
}

document.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', render);
});

render();
