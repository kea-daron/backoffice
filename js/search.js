const searchPages = [
  { id: 'accounts', name: 'Accounts Management', keywords: 'accounts users list members downline' },
  { id: 'subaccounts', name: 'Sub-Accounts Management', keywords: 'subaccounts sub-accounts masters' },
  { id: 'bankaccounts', name: 'Bank Accounts', keywords: 'bank accounts linked cards payout' },
  { id: 'bankgroups', name: 'Bank Groups', keywords: 'bank groups vip standard standard' },
  { id: 'depositrequests', name: 'Deposit Requests', keywords: 'deposit topup requests pending approve' },
  { id: 'withdrawalrequests', name: 'Withdrawal Requests', keywords: 'withdrawal payouts requests pending' },
  { id: 'transactions', name: 'Transaction History', keywords: 'transactions ledger history log' },
  { id: 'winlossreport', name: 'Win/Loss Report', keywords: 'win loss profit report provider statistics' },
  { id: 'security', name: 'Security Center', keywords: 'security password roles authorization 2fa' }
];

function handleHomeSearch() {
  const query = document.getElementById('home-search-input').value.trim().toLowerCase();
  const clearBtn = document.getElementById('home-search-clear');
  
  if (query.length > 0) {
    clearBtn.classList.remove('hidden');
  } else {
    clearBtn.classList.add('hidden');
  }
  
  renderSearchResults(query);
}

function clearHomeSearch() {
  const input = document.getElementById('home-search-input');
  input.value = '';
  input.focus();
  document.getElementById('home-search-clear').classList.add('hidden');
  renderSearchResults('');
}

function showSearchResults() {
  const resultsDiv = document.getElementById('home-search-results');
  resultsDiv.classList.remove('hidden');
  const query = document.getElementById('home-search-input').value.trim().toLowerCase();
  renderSearchResults(query);
}

function hideSearchResults() {
  document.getElementById('home-search-results').classList.add('hidden');
}

function toggleSearchFilterPopover(event) {
  if (event) {
    event.stopPropagation();
  }
  const popover = document.getElementById('search-filter-popover');
  popover.classList.toggle('hidden');
}

function hideSearchFilterPopover() {
  document.getElementById('search-filter-popover').classList.add('hidden');
}

function handleFilterChange() {
  const query = document.getElementById('home-search-input').value.trim().toLowerCase();
  renderSearchResults(query);
}

function renderSearchResults(query) {
  const resultsDiv = document.getElementById('home-search-results');
  resultsDiv.innerHTML = '';
  
  const searchPlayers = document.getElementById('filter-type-players').checked;
  const searchSubAccounts = document.getElementById('filter-type-subaccounts').checked;
  const searchPagesOpt = document.getElementById('filter-type-pages').checked;
  
  const statusFilter = document.querySelector('input[name="filter-status"]:checked').value;
  
  const filteredPlayers = [];
  const filteredSubAccounts = [];
  const filteredPages = [];
  
  // 1. Filter Pages
  if (searchPagesOpt) {
    searchPages.forEach(page => {
      if (!query || page.name.toLowerCase().includes(query) || page.keywords.toLowerCase().includes(query)) {
        filteredPages.push(page);
      }
    });
  }

  // 2. Filter Players (only if we have a query entered, otherwise we don't display all database items to keep it clean)
  if (searchPlayers && query) {
    Object.keys(players).forEach(username => {
      const p = players[username];
      if (statusFilter === 'active' && p.status.toLowerCase() !== 'active') return;
      
      if (p.username.toLowerCase().includes(query) || (p.email && p.email.toLowerCase().includes(query))) {
        filteredPlayers.push(p);
      }
    });
  }
  
  // 3. Filter Sub-Accounts (only if query entered)
  if (searchSubAccounts && query) {
    Object.keys(subAccounts).forEach(username => {
      const s = subAccounts[username];
      if (statusFilter === 'active' && s.status.toLowerCase() !== 'active') return;
      
      if (s.username.toLowerCase().includes(query)) {
        filteredSubAccounts.push(s);
      }
    });
  }
  
  const totalResults = filteredPlayers.length + filteredSubAccounts.length + filteredPages.length;
  
  if (totalResults === 0) {
    resultsDiv.innerHTML = '<div class="search-no-results">No results found</div>';
    return;
  }
  
  // Render Pages Group
  if (filteredPages.length > 0) {
    const group = document.createElement('div');
    group.className = 'search-result-group';
    group.innerHTML = `<div class="search-result-group-title">${query ? 'Pages Matches' : 'Suggested Shortcuts'}</div>`;
    
    filteredPages.forEach(page => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.onclick = function() {
        showView(page.id);
        hideSearchResults();
      };
      
      item.innerHTML = `
        <div class="search-result-badge page">📄</div>
        <div class="search-result-info">
          <div class="search-result-name">${page.name}</div>
          <div class="search-result-sub">Management View</div>
        </div>
      `;
      group.appendChild(item);
    });
    resultsDiv.appendChild(group);
  }
  
  // Render Players Group
  if (filteredPlayers.length > 0) {
    const group = document.createElement('div');
    group.className = 'search-result-group';
    group.innerHTML = '<div class="search-result-group-title">Members / Players</div>';
    
    filteredPlayers.forEach(p => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.onclick = function() {
        openPlayer(p.username);
        hideSearchResults();
      };
      
      const statusClass = p.status.toLowerCase() === 'active' ? 'status-active' : 'status-inactive';
      
      item.innerHTML = `
        <div class="search-result-badge player">P</div>
        <div class="search-result-info">
          <div class="search-result-name">${p.username}</div>
          <div class="search-result-sub">Balance: $${p.balance.toFixed(2)} • <span class="badge ${statusClass}" style="padding:2px 6px; font-size:9px; border-radius:8px; display:inline-block; width:auto; height:auto;">${p.status}</span></div>
        </div>
      `;
      group.appendChild(item);
    });
    resultsDiv.appendChild(group);
  }
  
  // Render Sub-Accounts Group
  if (filteredSubAccounts.length > 0) {
    const group = document.createElement('div');
    group.className = 'search-result-group';
    group.innerHTML = '<div class="search-result-group-title">Sub-Accounts</div>';
    
    filteredSubAccounts.forEach(s => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.onclick = function() {
        openSubAccount(s.username);
        hideSearchResults();
      };
      
      const statusClass = s.status.toLowerCase() === 'active' ? 'status-active' : 'status-inactive';
      
      item.innerHTML = `
        <div class="search-result-badge subaccount">S</div>
        <div class="search-result-info">
          <div class="search-result-name">${s.username}</div>
          <div class="search-result-sub">Role: ${s.role} • <span class="badge ${statusClass}" style="padding:2px 6px; font-size:9px; border-radius:8px; display:inline-block; width:auto; height:auto;">${s.status}</span></div>
        </div>
      `;
      group.appendChild(item);
    });
    resultsDiv.appendChild(group);
  }
}

// Close panels on click outside
document.addEventListener('click', function(event) {
  const searchSection = document.querySelector('.search-section');
  if (searchSection && !searchSection.contains(event.target)) {
    hideSearchResults();
    hideSearchFilterPopover();
  }
});
