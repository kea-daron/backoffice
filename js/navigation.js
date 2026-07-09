function showView(name){
  document.getElementById('view-home').classList.toggle('hidden', name !== 'home');
  document.getElementById('view-accounts').classList.toggle('hidden', name !== 'accounts');
  document.getElementById('view-downline').classList.toggle('hidden', name !== 'downline');
  document.getElementById('view-player').classList.toggle('hidden', name !== 'player');
  document.getElementById('view-subaccounts').classList.toggle('hidden', name !== 'subaccounts');
  document.getElementById('view-subaccount-detail').classList.toggle('hidden', name !== 'subaccount-detail');
  document.getElementById('view-bankaccounts').classList.toggle('hidden', name !== 'bankaccounts');
  document.getElementById('view-bankgroups').classList.toggle('hidden', name !== 'bankgroups');
  document.getElementById('view-depositrequests').classList.toggle('hidden', name !== 'depositrequests');
  document.getElementById('view-withdrawalrequests').classList.toggle('hidden', name !== 'withdrawalrequests');
  document.getElementById('view-transactions').classList.toggle('hidden', name !== 'transactions');
  document.getElementById('view-winlossreport').classList.toggle('hidden', name !== 'winlossreport');
  document.getElementById('view-security').classList.toggle('hidden', name !== 'security');
  document.getElementById('view-userrole').classList.toggle('hidden', name !== 'userrole');
  document.getElementById('view-useraccount').classList.toggle('hidden', name !== 'useraccount');
  document.getElementById('view-authorization').classList.toggle('hidden', name !== 'authorization');
  document.getElementById('view-changepassword').classList.toggle('hidden', name !== 'changepassword');


  if(name === 'userrole'){
    renderRoles();
  }
  if(name === 'useraccount'){
    renderUserAccounts();
  }
  if(name === 'authorization'){
    document.getElementById('auth-role-selector').value = '';
    document.getElementById('auth-permissions-container').innerHTML = '';
  }
}
