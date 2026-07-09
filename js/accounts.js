function openPlayer(username){
  var p = players[username];
  if(!p) return;
  currentAccount = p;
  currentAccountKind = 'player';

  document.getElementById('player-title').textContent = p.username;
  document.getElementById('player-breadcrumb-current').textContent = p.username;
  document.getElementById('player-username').textContent = p.username;
  document.getElementById('player-email').textContent = p.email;
  document.getElementById('player-phone').textContent = p.phone;
  document.getElementById('player-status').textContent = p.status;
  document.getElementById('player-balance').textContent = fmtMoney(p.balance);
  document.getElementById('player-created').textContent = p.createdAt;

  renderTxnRows(document.getElementById('player-txn-body'), p);

  showView('player');
}

function openModal(){
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal(){
  document.getElementById('modal-overlay').classList.add('hidden');
}
function toggleOnline(){
  document.getElementById('online-toggle').classList.toggle('on');
}

function openStatusModal(){
  document.getElementById('status-modal-overlay').classList.remove('hidden');
}
function closeStatusModal(){
  document.getElementById('status-modal-overlay').classList.add('hidden');
}

function openEditModal(){
  document.getElementById('edit-modal-overlay').classList.remove('hidden');
}
function closeEditModal(){
  document.getElementById('edit-modal-overlay').classList.add('hidden');
}
function toggleEditOnline(){
  document.getElementById('edit-online-toggle').classList.toggle('on');
}

function openResetModal(){
  document.getElementById('reset-modal-overlay').classList.remove('hidden');
}
function closeResetModal(){
  document.getElementById('reset-modal-overlay').classList.add('hidden');
}

function openChannelsModal(){
  document.getElementById('channels-modal-overlay').classList.remove('hidden');
}
function closeChannelsModal(){
  document.getElementById('channels-modal-overlay').classList.add('hidden');
}
function onChannelSelect(){
  const val = document.getElementById('new-channel-select').value;
  const commission = document.getElementById('new-commission-select');
  const share = document.getElementById('new-share-select');
  if(val && val !== 'Select a channel...'){
    commission.disabled = false;
    share.disabled = false;
    commission.innerHTML = '<option>5%</option><option>10%</option><option>15%</option>';
    share.innerHTML = '<option>0%</option><option>5%</option><option>10%</option>';
  }
}

function openDomainsModal(){
  document.getElementById('domains-modal-overlay').classList.remove('hidden');
}
function closeDomainsModal(){
  document.getElementById('domains-modal-overlay').classList.add('hidden');
}
