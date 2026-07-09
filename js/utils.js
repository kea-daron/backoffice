function statusLabel(value){
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function statusBadgeClass(status){
  switch(status.toLowerCase()){
    case 'active': return 'status-active';
    case 'inactive': return 'status-inactive';
    case 'suspended': return 'status-suspended';
    case 'pending': return 'status-pending';
    default: return 'status-active';
  }
}

function fmtMoney(n){
  return '$' + n.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function renderTxnRows(bodyEl, account){
  bodyEl.innerHTML = '';
  if(account.transactions.length === 0){
    bodyEl.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--ink-soft);padding:20px 4px;">No transactions yet</td></tr>';
    return;
  }
  account.transactions.forEach(function(t){
    var isPos = t.to === account.username;
    var row = document.createElement('tr');
    row.innerHTML =
      '<td><div style="font-weight:600;">' + t.from + ' → ' + t.to + '</div>' +
      '<div style="font-size:11px;color:var(--ink-soft);">' + t.date + '</div></td>' +
      '<td><span class="txn-type-badge">' + t.type + '</span></td>' +
      '<td class="txn-amount ' + (isPos ? 'pos' : 'neg') + '" style="text-align:right;">' +
      (isPos ? '+' : '-') + fmtMoney(t.amount) + '</td>';
    bodyEl.appendChild(row);
  });
}

function sendPrompt(msg){
  console.log('Action:', msg);
  alert(msg);
}
