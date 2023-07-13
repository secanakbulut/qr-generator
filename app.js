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

// escape commas, semicolons, backslashes for wifi/vcard formats
function esc(s) {
  return String(s).replace(/([\\;,":])/g, '\\$1');
}

function buildPayload() {
  if (activeTab === 'text') {
    return document.getElementById('text-input').value;
  }
  if (activeTab === 'url') {
    return document.getElementById('url-input').value;
  }
  if (activeTab === 'wifi') {
    const ssid = document.getElementById('wifi-ssid').value;
    const pass = document.getElementById('wifi-pass').value;
    const enc = document.getElementById('wifi-enc').value;
    if (!ssid) return '';
    return `WIFI:T:${enc};S:${esc(ssid)};P:${esc(pass)};;`;
  }
  if (activeTab === 'vcard') {
    const name = document.getElementById('vc-name').value.trim();
    const phone = document.getElementById('vc-phone').value.trim();
    const email = document.getElementById('vc-email').value.trim();
    if (!name && !phone && !email) return '';
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${name}`,
      `N:${name};;;;`,
    ];
    if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
    if (email) lines.push(`EMAIL:${email}`);
    lines.push('END:VCARD');
    return lines.join('\n');
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

document.querySelectorAll('input, textarea, select').forEach(el => {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
});

render();
