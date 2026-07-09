function renderGlobalTransactions(){
  var list = document.getElementById('global-txn-list');
  var typeFilter = document.getElementById('txn-filter-type').value;
  var fromDate = document.getElementById('txn-filter-from').value;
  var toDate = document.getElementById('txn-filter-to').value;

  var filtered = globalTransactions.filter(function(t){
    var matchesType = typeFilter === 'all' || t.type.toLowerCase() === typeFilter;
    var matchesFrom = !fromDate || t.dateISO >= fromDate;
    var matchesTo = !toDate || t.dateISO <= toDate;
    return matchesType && matchesFrom && matchesTo;
  });

  list.innerHTML = '';

  if(filtered.length === 0){
    list.innerHTML = '<div class="empty-state">No transactions found</div>';
    return;
  }

  filtered.forEach(function(t){
    var isDeposit = t.type.toLowerCase() === 'deposit';
    var row = document.createElement('div');
    row.className = 'txn-list-row';
    row.innerHTML =
      '<div class="txn-list-top">' +
        '<span class="txn-list-parties">' + t.from + ' → ' + t.to + '</span>' +
        '<span class="txn-amount ' + (isDeposit ? 'pos' : 'neg') + '">' + (isDeposit ? '+' : '-') + fmtMoney(t.amount) + '</span>' +
      '</div>' +
      '<div class="txn-list-bottom">' +
        '<span class="txn-type-badge">' + t.type + '</span>' +
        '<span class="txn-list-date">' + t.date + '</span>' +
      '</div>';
    list.appendChild(row);
  });
}

function resetTxnFilters(){
  document.getElementById('txn-filter-type').value = 'all';
  document.getElementById('txn-filter-from').value = '';
  document.getElementById('txn-filter-to').value = '';
  renderGlobalTransactions();
}
