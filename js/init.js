/* Initialize all rendered lists on page load */
renderSubaccountsTable();
renderBankAccounts();
renderBankGroups();
renderDepositRequests();
renderWithdrawalRequests();
renderGlobalTransactions();
renderWinLossReport();
renderRoles();
renderUserAccounts();

/* Dynamic time-based greeting */
(function setGreeting() {
  const h = new Date().getHours();
  const el = document.getElementById('home-greeting');
  if (!el) return;
  if (h >= 5 && h < 12)  el.textContent = 'Good morning \u2600\uFE0F';
  else if (h >= 12 && h < 17) el.textContent = 'Good afternoon \uD83C\uDF1E';
  else if (h >= 17 && h < 21) el.textContent = 'Good evening \uD83C\uDF07';
  else el.textContent = 'Good night \uD83C\uDF19';
})();
