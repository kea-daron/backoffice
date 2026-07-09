var bankLogoPalette = ['#16305c','#83651f','#2f6f5e','#5f7d63','#22302a'];

var bankLogoMap = {
  'ACLEDA': {color:'#16305c', initial:'A'},
  'ABA': {color:'#16305c', initial:'ABA'},
  'Wing': {color:'#5f7d63', initial:'W'},
  'TrueMoney': {color:'#a8632f', initial:'TM'},
  'Prince Bank': {color:'#83651f', initial:'PB'},
  'Canadia Bank': {color:'#22302a', initial:'CB'}
};

function getBankLogo(bankName, fallbackIdx){
  if(bankLogoMap[bankName]) return bankLogoMap[bankName];
  return {
    color: bankLogoPalette[(fallbackIdx || 0) % bankLogoPalette.length],
    initial: bankName.length <= 4 ? bankName.toUpperCase() : bankName.charAt(0).toUpperCase()
  };
}

function renderBankAccounts(){
  var list = document.getElementById('bankaccounts-list');
  list.innerHTML = '';
  bankAccounts.forEach(function(acc, idx){
    var card = document.createElement('div');
    card.className = 'bank-card';
    card.innerHTML =
      '<div class="bank-card-top">' +
        '<div class="bank-logo" style="background:' + acc.logoColor + ';">' + acc.logoInitial + '</div>' +
        '<div class="bank-name-block">' +
          '<div class="bank-name">' + acc.bank + '</div>' +
          '<span class="bank-group-chip">' + acc.group + '</span>' +
        '</div>' +
        '<div class="bank-badges">' +
          '<span class="badge ' + statusBadgeClass(acc.status) + '">' + acc.status + '</span>' +
          (acc.isDefault ? '<span class="badge default-yes">Default</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="bank-meta">' +
        '<div class="meta-block"><span class="meta-label">Account Name</span><span class="meta-value" style="font-size:14px;font-weight:700;color:var(--ink);">' + acc.accountName + '</span></div>' +
        '<div class="meta-block"><span class="meta-label">Account Number</span><span class="meta-value" style="font-size:14px;font-weight:700;color:var(--ink);">' + acc.accountNumber + '</span></div>' +
      '</div>' +
      '<div class="bank-actions">' +
        (acc.isDefault ? '<span style="font-size:11.5px;color:var(--ink-soft);font-weight:600;">Default account</span>' :
          '<span class="set-default-link" onclick="setDefaultBank(' + idx + ')">Set as Default</span>') +
        '<div style="display:flex;gap:8px;">' +
          '<button class="mini-btn edit-mini" onclick="openBankEditModal(' + idx + ')">' +
            '<svg viewBox="0 0 24 24"><path d="M4 20l1-4.5L15.5 5l3.5 3.5L8.5 19 4 20z" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
          '<button class="mini-btn delete-mini" onclick="deleteBankAccount(' + idx + ')">' +
            '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';
    list.appendChild(card);
  });
}

function setDefaultBank(idx){
  bankAccounts.forEach(function(a, i){ a.isDefault = (i === idx); });
  renderBankAccounts();
  sendPrompt('Set ' + bankAccounts[idx].bank + ' as default bank account');
}

function deleteBankAccount(idx){
  var removed = bankAccounts[idx];
  bankAccounts.splice(idx, 1);
  renderBankAccounts();
  sendPrompt('Remove bank account ' + removed.bank + ' ' + removed.accountNumber);
}

function openBankCreateModal(){
  document.getElementById('bank-create-bankname').value = '';
  document.getElementById('bank-create-accountname').value = '';
  document.getElementById('bank-create-accountnumber').value = '';
  document.getElementById('bank-create-group').value = 'VIP';
  document.getElementById('bank-create-default-toggle').classList.remove('on');
  document.getElementById('bank-create-modal-overlay').classList.remove('hidden');
}
function closeBankCreateModal(){
  document.getElementById('bank-create-modal-overlay').classList.add('hidden');
}
function confirmCreateBankAccount(){
  var bankName = document.getElementById('bank-create-bankname').value.trim();
  var accountName = document.getElementById('bank-create-accountname').value.trim();
  var accountNumber = document.getElementById('bank-create-accountnumber').value.trim();
  var group = document.getElementById('bank-create-group').value;
  var isDefault = document.getElementById('bank-create-default-toggle').classList.contains('on');

  if(!bankName || !accountName || !accountNumber){
    return;
  }

  if(isDefault){
    bankAccounts.forEach(function(a){ a.isDefault = false; });
  }

  var logo = getBankLogo(bankName, bankAccounts.length);

  bankAccounts.push({
    bank: bankName,
    accountName: accountName,
    accountNumber: accountNumber,
    group: group,
    status: 'Active',
    isDefault: isDefault,
    logoColor: logo.color,
    logoInitial: logo.initial,
    qrImage: null
  });

  renderBankAccounts();
  closeBankCreateModal();
  sendPrompt('Add new bank account ' + bankName + ' ' + accountNumber);
}

var currentBankEditIndex = null;
var bankEditQrData = null;

function openBankEditModal(idx){
  var acc = bankAccounts[idx];
  if(!acc) return;
  currentBankEditIndex = idx;
  bankEditQrData = acc.qrImage || null;

  var bankSelect = document.getElementById('bank-edit-bank');
  if(![...bankSelect.options].some(function(o){ return o.value === acc.bank; })){
    var opt = document.createElement('option');
    opt.value = acc.bank;
    opt.textContent = acc.bank;
    bankSelect.appendChild(opt);
  }
  bankSelect.value = acc.bank;

  document.getElementById('bank-edit-accountname').value = acc.accountName;
  document.getElementById('bank-edit-accountnumber').value = acc.accountNumber;
  document.getElementById('bank-edit-group').value = acc.group;
  document.getElementById('bank-edit-status').value = acc.status;
  document.getElementById('bank-edit-qr-filename').textContent = 'No file chosen';
  document.getElementById('bank-edit-qr-file').value = '';
  document.getElementById('bank-edit-default-toggle').classList.toggle('on', !!acc.isDefault);

  var previewWrap = document.getElementById('bank-edit-qr-preview-wrap');
  var previewImg = document.getElementById('bank-edit-qr-preview-img');
  if(bankEditQrData){
    previewImg.src = bankEditQrData;
    previewWrap.classList.remove('hidden');
  } else {
    previewImg.src = '';
    previewWrap.classList.add('hidden');
  }

  document.getElementById('bank-edit-modal-overlay').classList.remove('hidden');
}
function closeBankEditModal(){
  document.getElementById('bank-edit-modal-overlay').classList.add('hidden');
}
function onBankEditQrFileChange(event){
  var file = event.target.files && event.target.files[0];
  if(!file) return;
  document.getElementById('bank-edit-qr-filename').textContent = file.name;
  var reader = new FileReader();
  reader.onload = function(e){
    bankEditQrData = e.target.result;
    document.getElementById('bank-edit-qr-preview-img').src = bankEditQrData;
    document.getElementById('bank-edit-qr-preview-wrap').classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}
function removeBankEditQr(){
  bankEditQrData = null;
  document.getElementById('bank-edit-qr-file').value = '';
  document.getElementById('bank-edit-qr-filename').textContent = 'No file chosen';
  document.getElementById('bank-edit-qr-preview-wrap').classList.add('hidden');
  document.getElementById('bank-edit-qr-preview-img').src = '';
}
function confirmBankEdit(){
  if(currentBankEditIndex === null) return;
  var acc = bankAccounts[currentBankEditIndex];
  if(!acc) return;

  var newBank = document.getElementById('bank-edit-bank').value;
  var newAccountName = document.getElementById('bank-edit-accountname').value.trim();
  var newAccountNumber = document.getElementById('bank-edit-accountnumber').value.trim();
  var newGroup = document.getElementById('bank-edit-group').value;
  var newStatus = document.getElementById('bank-edit-status').value;
  var newIsDefault = document.getElementById('bank-edit-default-toggle').classList.contains('on');

  if(!newAccountName || !newAccountNumber){
    return;
  }

  if(newIsDefault){
    bankAccounts.forEach(function(a){ a.isDefault = false; });
  }

  if(newBank !== acc.bank){
    var logo = getBankLogo(newBank, currentBankEditIndex);
    acc.logoColor = logo.color;
    acc.logoInitial = logo.initial;
  }

  acc.bank = newBank;
  acc.accountName = newAccountName;
  acc.accountNumber = newAccountNumber;
  acc.group = newGroup;
  acc.status = newStatus;
  acc.isDefault = newIsDefault;
  acc.qrImage = bankEditQrData;

  renderBankAccounts();
  closeBankEditModal();
  sendPrompt('Save changes for bank account ' + acc.bank + ' ' + acc.accountNumber);
}
