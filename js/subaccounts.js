function renderSubaccountsTable(){
  var tbody = document.getElementById('subaccounts-tbody');
  tbody.innerHTML = '';
  Object.keys(subAccounts).forEach(function(username){
    var a = subAccounts[username];
    var row = document.createElement('tr');
    row.innerHTML =
      '<td><span class="subaccount-username" onclick="openSubAccount(\'' + username + '\')">' + username + '</span></td>' +
      '<td><span class="badge role-master">' + a.role + '</span></td>' +
      '<td><span class="badge ' + statusBadgeClass(a.status) + '" style="cursor:pointer;" onclick="openSubaccountStatusModal(\'' + username + '\')">' + a.status + '</span></td>';
    tbody.appendChild(row);
  });
}

function openSubaccountStatusModal(username){
  var a = subAccounts[username];
  if(!a) return;
  subaccountStatusTarget = username;
  document.getElementById('subaccount-status-modal-title').textContent = 'Change Status for ' + username;
  document.getElementById('subaccount-status-select').value = a.status.toLowerCase();
  document.getElementById('subaccount-status-modal-overlay').classList.remove('hidden');
}
function closeSubaccountStatusModal(){
  document.getElementById('subaccount-status-modal-overlay').classList.add('hidden');
}
function confirmSubaccountStatus(){
  if(!subaccountStatusTarget) return;
  var val = document.getElementById('subaccount-status-select').value;
  var newStatus = statusLabel(val);
  subAccounts[subaccountStatusTarget].status = newStatus;

  renderSubaccountsTable();

  if(currentAccountKind === 'subaccount' && currentAccount && currentAccount.username === subaccountStatusTarget){
    document.getElementById('subaccount-status').textContent = newStatus;
    document.getElementById('subaccount-status').className = 'badge ' + statusBadgeClass(newStatus);
  }

  var target = subaccountStatusTarget;
  closeSubaccountStatusModal();
  sendPrompt('Save status change for ' + target);
}

function openSubAccount(username){
  var a = subAccounts[username];
  if(!a) return;
  currentAccount = a;
  currentAccountKind = 'subaccount';

  document.getElementById('subaccount-title').textContent = a.username;
  document.getElementById('subaccount-breadcrumb-current').textContent = a.username;
  document.getElementById('subaccount-username').textContent = a.username;
  document.getElementById('subaccount-role').textContent = a.role;
  document.getElementById('subaccount-status').textContent = a.status;
  document.getElementById('subaccount-status').className = 'badge ' + statusBadgeClass(a.status);
  document.getElementById('subaccount-balance').textContent = fmtMoney(a.balance);

  renderTxnRows(document.getElementById('subaccount-txn-body'), a);

  showView('subaccount-detail');
}

function openSubaccountCreateModal(){
  document.getElementById('subaccount-create-username').value = '';
  document.getElementById('subaccount-create-email').value = '';
  document.getElementById('subaccount-create-password').value = '';
  document.getElementById('subaccount-create-modal-overlay').classList.remove('hidden');
}
function closeSubaccountCreateModal(){
  document.getElementById('subaccount-create-modal-overlay').classList.add('hidden');
}
function confirmCreateSubaccount(){
  var raw = document.getElementById('subaccount-create-username').value.trim();
  if(!raw){
    return;
  }
  var username = raw + '@AAABBBMM';

  subAccounts[username] = {
    username: username,
    role: 'Master',
    status: 'Active',
    balance: 0,
    createdAt: new Date().toLocaleString('en-US'),
    transactions: []
  };

  renderSubaccountsTable();

  closeSubaccountCreateModal();
  sendPrompt('Create new sub-account ' + username);
}
