const screen = document.getElementById('screen');
const notes = document.getElementById('flow-notes');
let flow = 'reminder';
let state = 'review';
let target = 'this';

const shell = (body, step = 1) => `<div class="mobile-header"><span class="mobile-brand">saily<span>®</span></span><span>✕</span></div><div class="stepper"><i class="done"></i><i class="${step > 1 ? 'done' : ''}"></i><i class="${step > 2 ? 'done' : ''}"></i></div><div class="content">${body}</div>`;
const cta = (label, action, disabled = false) => `<button class="primary" data-action="${action}" ${disabled ? 'disabled' : ''}>${label}</button>`;

function renderNotes(){
  notes.innerHTML = flow === 'reminder' ? `<div class="note-number">FLOW 01 · LOW EFFORT</div><h3>Make compatibility impossible to miss.</h3><p>A contextual reminder keeps checkout unchanged while asking the traveler to validate the device they will actually use.</p><ul class="note-list"><li><strong>Best for:</strong> a fast, low-risk experiment</li><li><strong>Strength:</strong> adds no material checkout friction</li><li><strong>Trade-off:</strong> relies on the customer checking</li></ul>` : `<div class="note-number">FLOW 02 · RECOMMENDED</div><h3>Verify the target device before payment.</h3><p>The choice of <em>this device</em> or <em>another device</em> handles purchases made from a laptop, tablet, or someone else’s phone.</p><ul class="note-list"><li><strong>Best for:</strong> reducing failed installations and refunds</li><li><strong>Strength:</strong> blocks incompatible devices early</li><li><strong>Trade-off:</strong> needs a maintained device database</li></ul>`;
}

function render(){
  renderNotes();
  if(flow === 'reminder') {
    screen.innerHTML = shell(`<p class="kicker">Review your order</p><h2>Japan · 10 GB</h2><p class="sub">30 days of data, ready when you land.</p><div class="plan"><div class="plan-top"><span>Japan eSIM</span><span>$17.99</span></div><small>10 GB · 30 days · One-time purchase</small></div><div class="notice"><div class="notice-title">Will the device you use support eSIM?</div><p>You can buy this plan here and install it later on another compatible device.</p><button class="text-link" data-action="supported">Check supported devices</button></div><label class="check-row"><input id="verified" type="checkbox" ${state === 'checked' ? 'checked' : ''}/><span>I verified that the device I’ll use supports eSIM.</span></label>${cta('Continue to checkout','checkout',state !== 'checked')}`);
  } else if(state === 'choose') {
    screen.innerHTML = shell(`<button class="back" data-action="back">← Back to order</button><p class="kicker">Before payment</p><h2>Which device will use this eSIM?</h2><p class="sub">The device you’re buying on may be different from the one you’ll install it on.</p><div class="device-options"><button class="device-option ${target==='this'?'selected':''}" data-action="select-this"><span class="radio"></span><span><strong>This device</strong><small>We’ll check it automatically if we can.</small></span></button><button class="device-option ${target==='other'?'selected':''}" data-action="select-other"><span class="radio"></span><span><strong>Another device</strong><small>Search for the phone or tablet you’ll use.</small></span></button></div>${cta('Continue','continue')}`,2);
  } else if(state === 'detected') {
    screen.innerHTML = shell(`<button class="back" data-action="back">← Change device</button><p class="kicker">Device check</p><h2>We found your device</h2><div class="detected"><span class="device-icon">▯</span><span><strong>iPhone 15 Pro</strong><span>This device · iOS 18</span></span></div><div class="result"><strong>✓ This device supports eSIM</strong><p>You can continue with this plan.</p></div>${cta('Continue to payment','payment')}`,2);
  } else if(state === 'search') {
    screen.innerHTML = shell(`<button class="back" data-action="back">← Change device</button><p class="kicker">Target device</p><h2>Find the device you’ll use</h2><label class="search-label" for="model-search">Device model</label><input id="model-search" class="search" placeholder="Search iPhone, Samsung, Pixel…" autofocus /><div class="models"><button class="model" data-action="compatible">iPhone 13</button><button class="model" data-action="compatible">Samsung Galaxy S24</button><button class="model" data-action="incompatible">Samsung Galaxy A14</button><button class="model" data-action="compatible">Google Pixel 9</button></div><button class="text-link" data-action="supported">See all supported devices</button>`,2);
  } else if(state === 'compatible') {
    screen.innerHTML = shell(`<button class="back" data-action="back">← Change device</button><p class="kicker">Device check</p><h2>iPhone 13</h2><div class="result"><strong>✓ Compatible with eSIM</strong><p>This device can install and use your Japan eSIM.</p></div>${cta('Continue to payment','payment')}`,2);
  } else if(state === 'incompatible') {
    screen.innerHTML = shell(`<button class="back" data-action="back">← Choose another device</button><p class="kicker">Device check</p><h2>Samsung Galaxy A14</h2><div class="result bad"><strong>This device doesn’t support eSIM</strong><p>Choose a different compatible device before you buy this plan.</p></div>${cta('Choose another device','search')}`,2);
  } else if(state === 'payment') {
    screen.innerHTML = shell(`<p class="kicker">Almost there</p><h2>Ready for payment</h2><div class="result"><strong>✓ Device compatibility confirmed</strong><p>Your eSIM will be available to install on the selected device after purchase.</p></div><div class="plan"><div class="plan-top"><span>Japan eSIM</span><span>$17.99</span></div><small>10 GB · 30 days</small></div>${cta('Pay securely','paid')}`,3);
  } else {
    screen.innerHTML = shell(`<p class="kicker">Payment complete</p><h2>Your Japan eSIM is ready</h2><p class="sub">Install it on your selected compatible device when you’re ready.</p><div class="result"><strong>✓ Purchase protected by device verification</strong></div>${cta('View installation steps','install')}`,3);
  }
  bind();
}
function bind(){
  document.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', () => {
    const a = el.dataset.action;
    if(a === 'checkout') state='payment';
    else if(a === 'supported') alert('Supported-device list\n\n• iPhone XS and newer\n• Google Pixel 3 and newer\n• Samsung Galaxy S20 and newer\n\nAvailability can vary by model and region.');
    else if(a === 'select-this'){target='this'; render(); return;}
    else if(a === 'select-other'){target='other'; render(); return;}
    else if(a === 'continue') state = target === 'this' ? 'detected' : 'search';
    else if(a === 'compatible') state='compatible';
    else if(a === 'incompatible') state='incompatible';
    else if(a === 'payment') state='payment';
    else if(a === 'paid') state='paid';
    else if(a === 'back') state='choose';
    else if(a === 'search') state='search';
    else if(a === 'install') alert('Installation setup\n\nOn the target device, open the Saily app or scan the QR code shown after purchase.');
    render();
  }));
  const check = document.getElementById('verified');
  if(check) check.addEventListener('change', () => { state = check.checked ? 'checked' : 'review'; render(); });
}
document.querySelectorAll('.flow-tab').forEach(tab => tab.addEventListener('click', () => { flow=tab.dataset.flow; state=flow==='reminder'?'review':'choose'; document.querySelectorAll('.flow-tab').forEach(t=>t.classList.toggle('active',t===tab)); render(); }));
render();
