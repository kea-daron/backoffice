function openTopupModal(){
  if(!currentAccount) return;
  topupSelectedAmount = 0;
  document.getElementById('topup-modal-title').textContent = 'Top Up ' + currentAccount.username;
  document.getElementById('topup-custom-amount').value = '';
  document.getElementById('topup-note').value = '';
  document.querySelectorAll('#topup-amount-grid .topup-chip').forEach(function(c){ c.classList.remove('selected'); });
  document.getElementById('topup-new-balance').textContent = fmtMoney(currentAccount.balance);
  document.getElementById('topup-modal-overlay').classList.remove('hidden');
}
function closeTopupModal(){
  document.getElementById('topup-modal-overlay').classList.add('hidden');
}
function selectTopupAmount(el, amount){
  document.querySelectorAll('#topup-amount-grid .topup-chip').forEach(function(c){ c.classList.remove('selected'); });
  el.classList.add('selected');
  topupSelectedAmount = amount;
  document.getElementById('topup-custom-amount').value = amount;
  updateTopupSummary();
}
function onTopupCustomInput(){
  document.querySelectorAll('#topup-amount-grid .topup-chip').forEach(function(c){ c.classList.remove('selected'); });
  var val = parseFloat(document.getElementById('topup-custom-amount').value);
  topupSelectedAmount = isNaN(val) ? 0 : val;
  updateTopupSummary();
}
function updateTopupSummary(){
  var newBal = currentAccount.balance + (topupSelectedAmount || 0);
  document.getElementById('topup-new-balance').textContent = fmtMoney(newBal);
}
function confirmTopup(){
  if(!currentAccount || !topupSelectedAmount || topupSelectedAmount <= 0){
    return;
  }
  var fromLabel = currentAccountKind === 'player' ? currentAccount.breadcrumbParent : 'AAABBBMM';
  currentAccount.balance += topupSelectedAmount;
  currentAccount.transactions.unshift({
    from: fromLabel,
    to: currentAccount.username,
    type: 'Deposit',
    amount: topupSelectedAmount,
    date: new Date().toLocaleString('en-US')
  });
  var refreshUsername = currentAccount.username;
  var refreshKind = currentAccountKind;
  closeTopupModal();
  if(refreshKind === 'player'){
    openPlayer(refreshUsername);
  } else {
    openSubAccount(refreshUsername);
  }
  sendPrompt('Top up ' + fmtMoney(topupSelectedAmount) + ' for ' + refreshUsername);
}
