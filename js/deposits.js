function depositStatusBadgeClass(status){
  switch(status.toLowerCase()){
    case 'pending': return 'status-pending';
    case 'approved': return 'status-active';
    case 'rejected': return 'status-suspended';
    default: return 'status-pending';
  }
}

/* ---- Deposit Requests ---- */
function renderDepositRequests(){
  var list = document.getElementById('depositrequests-list');
  var usernameFilter = document.getElementById('deposit-filter-username').value.trim().toLowerCase();
  var statusFilter = document.getElementById('deposit-filter-status').value;

  var filtered = depositRequests.filter(function(r){
    var matchesUsername = !usernameFilter || r.player.toLowerCase().indexOf(usernameFilter) !== -1;
    var matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter;
    return matchesUsername && matchesStatus;
  });

  list.innerHTML = '';

  if(filtered.length === 0){
    list.innerHTML = '<div class="empty-state">No deposit requests found</div>';
    return;
  }

  filtered.forEach(function(r){
    var card = document.createElement('div');
    card.className = 'deposit-card';
    card.innerHTML =
      '<div class="deposit-card-top">' +
        '<div>' +
          '<div class="deposit-player">' + r.player + '</div>' +
          '<div class="deposit-amount">' + fmtMoney(r.amount) + '</div>' +
        '</div>' +
        '<span class="badge ' + depositStatusBadgeClass(r.status) + '">' + r.status + '</span>' +
      '</div>' +
      '<div class="deposit-meta">' +
        '<div class="meta-block"><span class="meta-label">Deposited To</span><span class="meta-value">' + r.depositedTo + '</span></div>' +
        '<div class="meta-block"><span class="meta-label">Player Bank</span><span class="meta-value">' + r.playerBank + '</span></div>' +
        '<div class="meta-block"><span class="meta-label">TXN Ref</span><span class="meta-value">' + r.txnRef + '</span></div>' +
        '<div class="meta-block"><span class="meta-label">Proof</span><span class="meta-value">' + r.proof + '</span></div>' +
        '<div class="meta-block" style="grid-column:1 / -1;"><span class="meta-label">Submitted At</span><span class="meta-value">' + r.submittedAt + '</span></div>' +
      '</div>' +
      (r.status === 'Pending' ?
        '<div class="deposit-actions">' +
          '<button class="pill-btn approve" onclick="approveDeposit(\'' + r.id + '\')">' +
            '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            'Approve' +
          '</button>' +
          '<button class="pill-btn reject" onclick="rejectDeposit(\'' + r.id + '\')">' +
            '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            'Reject' +
          '</button>' +
        '</div>' : '');
    list.appendChild(card);
  });
}

function approveDeposit(id){
  var r = depositRequests.find(function(x){ return x.id === id; });
  if(!r) return;
  r.status = 'Approved';
  renderDepositRequests();
  sendPrompt('Approve deposit request ' + id + ' for ' + r.player);
}

function rejectDeposit(id){
  var r = depositRequests.find(function(x){ return x.id === id; });
  if(!r) return;
  r.status = 'Rejected';
  renderDepositRequests();
  sendPrompt('Reject deposit request ' + id + ' for ' + r.player);
}

/* ---- Withdrawal Requests ---- */
function renderWithdrawalRequests(){
  var list = document.getElementById('withdrawalrequests-list');
  var usernameFilter = document.getElementById('withdrawal-filter-username').value.trim().toLowerCase();
  var statusFilter = document.getElementById('withdrawal-filter-status').value;

  var filtered = withdrawalRequests.filter(function(r){
    var matchesUsername = !usernameFilter || r.player.toLowerCase().indexOf(usernameFilter) !== -1;
    var matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter;
    return matchesUsername && matchesStatus;
  });

  list.innerHTML = '';

  if(filtered.length === 0){
    list.innerHTML = '<div class="empty-state">No withdrawal requests found</div>';
    return;
  }

  filtered.forEach(function(r){
    var card = document.createElement('div');
    card.className = 'deposit-card';
    card.innerHTML =
      '<div class="deposit-card-top">' +
        '<div>' +
          '<div class="deposit-player">' + r.player + '</div>' +
          '<div class="deposit-amount">' + fmtMoney(r.amount) + '</div>' +
        '</div>' +
        '<span class="badge ' + depositStatusBadgeClass(r.status) + '">' + r.status + '</span>' +
      '</div>' +
      '<div class="deposit-meta">' +
        '<div class="meta-block" style="grid-column:1 / -1;"><span class="meta-label">Withdraw To</span><span class="meta-value">' + r.withdrawTo + '</span></div>' +
        '<div class="meta-block" style="grid-column:1 / -1;"><span class="meta-label">Submitted At</span><span class="meta-value">' + r.submittedAt + '</span></div>' +
      '</div>' +
      (r.status === 'Pending' ?
        '<div class="deposit-actions">' +
          '<button class="pill-btn approve" onclick="approveWithdrawal(\'' + r.id + '\')">' +
            '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            'Approve' +
          '</button>' +
          '<button class="pill-btn reject" onclick="rejectWithdrawal(\'' + r.id + '\')">' +
            '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            'Reject' +
          '</button>' +
        '</div>' : '');
    list.appendChild(card);
  });
}

function approveWithdrawal(id){
  var r = withdrawalRequests.find(function(x){ return x.id === id; });
  if(!r) return;
  r.status = 'Approved';
  renderWithdrawalRequests();
  sendPrompt('Approve withdrawal request ' + id + ' for ' + r.player);
}

function rejectWithdrawal(id){
  var r = withdrawalRequests.find(function(x){ return x.id === id; });
  if(!r) return;
  r.status = 'Rejected';
  renderWithdrawalRequests();
  sendPrompt('Reject withdrawal request ' + id + ' for ' + r.player);
}
