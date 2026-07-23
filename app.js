const screen = document.getElementById('screen');
const notes = document.getElementById('flow-notes');
let flow = 'reminder';
let state = 'plans';
let target = 'this';
let selectedPlan = '10 GB';
let checkedDevice = '';
let pickerQuery = '';
let pickerStatus = '';

const shell = (title, body) => `<div class="saily-mobile-head"><button class="round-control" data-action="back" aria-label="Go back">‹</button><strong>${title}</strong><button class="round-control close" aria-label="Close">×</button></div><div class="content saily-content">${body}</div>`;
const cta = (label, action, disabled = false) => `<button class="saily-cta" data-action="${action}" ${disabled ? 'disabled' : ''}>${label}</button>`;
const orderSummary = () => `<div class="checkout-card"><h3>Order summary</h3><div class="country-chip"><span>🇯🇵</span> Japan</div><div class="summary-row"><span>Plan</span><b>${selectedPlan}</b></div><div class="summary-row"><span>Type</span><b>Data only</b></div><div class="summary-row"><span>Duration</span><b>30 days</b></div></div><div class="checkout-card compact"><div class="summary-row"><span>Activate before</span><b>08/22/2026</b></div><p class="small-copy">Your plan activates when you arrive at your destination. If you don’t travel by 08/22/2026, it will auto-activate on that date.</p><div class="summary-row total"><span>Total</span><b>US$17.99</b></div></div>`;

function renderNotes(){
  notes.innerHTML = flow === 'reminder'
    ? `<div class="note-number">FLOW 01 · LOW EFFORT</div><h3>Place the reminder in the familiar checkout.</h3><p>The traveler selects their plan as usual. A clearly labelled compatibility card appears in checkout <strong>before payment methods</strong>.</p><ul class="note-list"><li><strong>Entry point:</strong> plan selection → checkout</li><li><strong>Message:</strong> check the device that will use the eSIM</li><li><strong>Trade-off:</strong> user self-confirms compatibility</li></ul>`
    : `<div class="note-number">FLOW 02 · RECOMMENDED</div><h3>Confirm the target device before checkout.</h3><p>Immediately after choosing a plan, Saily asks which device will use it. Only a compatible device reaches the existing payment screen.</p><ul class="note-list"><li><strong>Entry point:</strong> after tapping Continue on plans</li><li><strong>Supports:</strong> buying from a different device</li><li><strong>Outcome:</strong> incompatible models cannot proceed to payment</li></ul>`;
}

function plans(){
  return shell('Available plans', `<div class="country-chip top"><span>🇯🇵</span> Japan</div><div class="ultra-banner"><b>Ultra</b><span>Enjoy big perks with 63% savings.</span></div><div class="plan-list">${[['1 GB','7 days','US$3.99'],['3 GB','30 days','US$7.99'],['5 GB','30 days','US$10.99'],['10 GB','30 days','US$17.99']].map(([name,days,price]) => `<button class="plan-choice ${selectedPlan===name?'is-plan-selected':''}" data-plan="${name}"><span class="plan-radio"></span><span><b>${name}</b><small>${days}</small><em>▣ 3% in Saily credits</em></span><strong>${price}</strong></button>`).join('')}</div>${cta('Continue','continue-plans')}`);
}

function devicePicker(){
  const devices=[['iPhone 13','compatible'],['Samsung Galaxy S24','compatible'],['Samsung Galaxy A14','incompatible'],['Google Pixel 9','compatible']];
  const list=devices.filter(([name])=>name.toLowerCase().includes(pickerQuery.toLowerCase()));
  const result = pickerStatus==='compatible' ? `<div class="picker-result"><strong>✓ ${checkedDevice} supports eSIM</strong><p>You can use this device with your Japan plan.</p>${cta('Use this device','use-device')}</div>` : pickerStatus==='incompatible' ? `<div class="picker-result bad"><strong>${checkedDevice} doesn’t support eSIM</strong><p>Choose another compatible device to continue.</p></div>` : `<div class="picker-list">${list.map(([name,status])=>`<button class="picker-device" data-picker-device="${name}" data-picker-status="${status}"><span><b>${name}</b><small class="device-status ${status}">${status==='compatible'?'✓ Supports eSIM':'✕ Doesn’t support eSIM'}</small></span><i>›</i></button>`).join('')}</div>`;
  return `<div class="picker-backdrop"><section class="device-picker" role="dialog" aria-label="Supported devices"><div class="picker-handle"></div><div class="picker-title"><strong>Check supported devices</strong><button data-action="close-picker" aria-label="Close">×</button></div><p>Find the device that will use this eSIM.</p><input id="picker-search" class="search" value="${pickerQuery}" placeholder="Search iPhone, Samsung, Pixel…" autofocus />${result}<button class="text-link picker-all" data-action="all-devices">See all supported devices</button></section></div>`;
}

function checkout(includeReminder = false){
  const isPicker=state==='reminder-picker';
  const verified=checkedDevice ? `<span class="verified-device">✓ ${checkedDevice} verified</span>` : '';
  const reminder = includeReminder ? `<div class="compat-card"><div><b>Will the device you use support eSIM?</b><p>You can buy this plan on this device and install it later on another compatible device.</p><button class="text-link" data-action="open-device-picker">Check supported devices</button>${verified}</div><label class="check-row"><input id="verified" type="checkbox" ${state==='reminder-checked'?'checked':''}/><span>I’ve checked my device</span></label></div>` : '';
  return shell('Checkout', `${orderSummary()}${reminder}<div class="checkout-card payment-card"><h3>Select a payment method</h3><button class="payment-option"><b> Pay</b><span>⌃</span></button><button class="payment-option"><b>Credit or debit card</b><span>⌄</span></button>${cta('Buy with  Pay','paid',includeReminder && state!=='reminder-checked')}</div>${isPicker?devicePicker():''}`);
}

function deviceChoice(){
  return shell('Check compatibility', `<p class="screen-label">Before checkout</p><h2>Which device will use this eSIM?</h2><p class="sub">It may be different from the device you’re buying on.</p><div class="device-options"><button class="device-option ${target==='this'?'selected':''}" data-action="select-this"><span class="radio"></span><span><strong>This device</strong><small>We’ll detect its model when possible.</small></span></button><button class="device-option ${target==='other'?'selected':''}" data-action="select-other"><span class="radio"></span><span><strong>Another device</strong><small>Search for the phone or tablet you’ll use.</small></span></button></div>${cta('Continue','continue-device')}`);
}

function render(){
  renderNotes();
  if(state === 'plans') screen.innerHTML = plans();
  else if(state === 'reminder-checkout' || state === 'reminder-checked' || state === 'reminder-picker') screen.innerHTML = checkout(true);
  else if(state === 'checkout') screen.innerHTML = checkout(false);
  else if(state === 'device-choice') screen.innerHTML = deviceChoice();
  else if(state === 'detected') screen.innerHTML = shell('Check compatibility', `<button class="back" data-action="device-choice">← Change device</button><p class="screen-label">This device</p><h2>iPhone 15 Pro</h2><div class="result"><strong>✓ Compatible with eSIM</strong><p>This device can install and use your Japan eSIM.</p></div>${cta('Continue to checkout','checkout')}`);
  else if(state === 'search') screen.innerHTML = shell('Check compatibility', `<button class="back" data-action="device-choice">← Change device</button><p class="screen-label">Another device</p><h2>Find the device you’ll use</h2><input class="search" placeholder="Search iPhone, Samsung, Pixel…" autofocus /><div class="models"><button class="model" data-action="compatible">iPhone 13</button><button class="model" data-action="compatible">Samsung Galaxy S24</button><button class="model" data-action="incompatible">Samsung Galaxy A14</button><button class="model" data-action="compatible">Google Pixel 9</button></div><button class="text-link" data-action="supported">See all supported devices</button>`);
  else if(state === 'compatible') screen.innerHTML = shell('Check compatibility', `<button class="back" data-action="search">← Change device</button><p class="screen-label">Another device</p><h2>iPhone 13</h2><div class="result"><strong>✓ Compatible with eSIM</strong><p>This device can install and use your Japan eSIM.</p></div>${cta('Continue to checkout','checkout')}`);
  else if(state === 'incompatible') screen.innerHTML = shell('Check compatibility', `<button class="back" data-action="search">← Choose another device</button><p class="screen-label">Another device</p><h2>Samsung Galaxy A14</h2><div class="result bad"><strong>This device doesn’t support eSIM</strong><p>Choose another compatible device before you buy this plan.</p></div>${cta('Choose another device','search')}`);
  else screen.innerHTML = shell('Checkout', `<p class="screen-label">Payment complete</p><h2>Your Japan eSIM is ready</h2><p class="sub">Install it on the compatible device you selected.</p><div class="result"><strong>✓ Purchase protected by device verification</strong></div>`);
  bind();
}

function bind(){
  document.querySelectorAll('[data-plan]').forEach(el => el.addEventListener('click', () => { selectedPlan=el.dataset.plan; render(); }));
  document.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', () => {
    const a=el.dataset.action;
    if(a==='continue-plans') state=flow==='reminder'?'reminder-checkout':'device-choice';
    else if(a==='select-this'){ target='this'; render(); return; }
    else if(a==='select-other'){ target='other'; render(); return; }
    else if(a==='continue-device') state=target==='this'?'detected':'search';
    else if(a==='compatible') state='compatible';
    else if(a==='incompatible') state='incompatible';
    else if(a==='device-choice') state='device-choice';
    else if(a==='search') state='search';
    else if(a==='checkout') state='checkout';
    else if(a==='paid') state='paid';
    else if(a==='open-device-picker'){ pickerQuery=''; pickerStatus=''; state='reminder-picker'; }
    else if(a==='close-picker'){ pickerStatus=''; state='reminder-checkout'; }
    else if(a==='use-device'){ state='reminder-checked'; }
    else if(a==='all-devices') alert('Supported-device list\n\n• iPhone XS and newer\n• Google Pixel 3 and newer\n• Samsung Galaxy S20 and newer\n\nAvailability can vary by model and region.');
    else if(a==='back') state='plans';
    render();
  }));
  const check=document.getElementById('verified');
  if(check) check.addEventListener('change',()=>{state=check.checked?'reminder-checked':'reminder-checkout';render();});
  document.querySelectorAll('[data-picker-device]').forEach(el=>el.addEventListener('click',()=>{ checkedDevice=el.dataset.pickerDevice; pickerStatus=el.dataset.pickerStatus; render(); }));
  const pickerSearch=document.getElementById('picker-search');
  if(pickerSearch) pickerSearch.addEventListener('input',()=>{ pickerQuery=pickerSearch.value; pickerStatus=''; render(); document.getElementById('picker-search')?.focus(); });
}
document.querySelectorAll('.flow-tab').forEach(tab => tab.addEventListener('click', () => { flow=tab.dataset.flow; state='plans'; document.querySelectorAll('.flow-tab').forEach(t=>t.classList.toggle('active',t===tab)); render(); }));
render();
