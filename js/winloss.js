function renderWinLossReport(){
  var list = document.getElementById('winlossreport-list');
  list.innerHTML = '';

  if(winLossReportData.length === 0){
    list.innerHTML = '<div class="empty-state">No report data found</div>';
    return;
  }

  winLossReportData.forEach(function(r){
    var isPos = r.winLoss >= 0;
    var card = document.createElement('div');
    card.className = 'report-card';
    card.innerHTML =
      '<div class="report-date">' + r.date + '</div>' +
      '<div class="report-meta">' +
        '<div class="meta-block"><span class="meta-label">Bet Count</span><span class="meta-value">' + r.betCount + '</span></div>' +
        '<div class="meta-block"><span class="meta-label">Total Turnover</span><span class="meta-value">' + fmtMoney(r.turnover) + '</span></div>' +
        '<div class="meta-block"><span class="meta-label">Total Win</span><span class="meta-value">' + fmtMoney(r.win) + '</span></div>' +
        '<div class="meta-block"><span class="meta-label">Win/Loss</span><span class="meta-value ' + (isPos ? 'pos' : 'neg') + '">' + (isPos ? '+' : '-') + fmtMoney(Math.abs(r.winLoss)) + '</span></div>' +
      '</div>';
    list.appendChild(card);
  });
}

function searchWinLossReport(){
  var range = document.getElementById('report-filter-range').value;
  var start = document.getElementById('report-filter-start').value;
  var end = document.getElementById('report-filter-end').value;
  var provider = document.getElementById('report-filter-provider').value;
  renderWinLossReport();
  sendPrompt('Search win/loss report ' + range + ' ' + start + ' to ' + end + ' provider ' + provider);
}
