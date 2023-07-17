// qr generator. uses qrcode.js from cdn.

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const canvas = document.getElementById('qr');
const status = document.getElementById('status');
const downloadBtn = document.getElementById('download');
const eclSelect = document.getElementById('ecl');

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
    // vcard 3.0, simple
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
    downloadBtn.disabled = true;
    return;
  }
  QRCode.toCanvas(canvas, payload, {
    errorCorrectionLevel: eclSelect.value,
    width: 280,
    margin: 2,
    color: { dark: '#1c1c1c', light: '#ffffff' }
  }, err => {
    if (err) {
      status.textContent = 'error: ' + err.message;
      downloadBtn.disabled = true;
      return;
    }
    status.textContent = `${payload.length} chars, ecl ${eclSelect.value}`;
    downloadBtn.disabled = false;
  });
}

// listen on every input
document.querySelectorAll('input, textarea, select').forEach(el => {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
});

downloadBtn.addEventListener('click', () => {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `qr-${activeTab}-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
});

render();
