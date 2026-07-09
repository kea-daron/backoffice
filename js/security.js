/* ---- User Roles ---- */
var roleIconSvgs = {
  crown: '<svg viewBox="0 0 24 24"><path d="M3 8l4 3 5-6 5 6 4-3-2 11H5L3 8z" stroke-linecap="round" stroke-linejoin="round"/><line x1="5" y1="21" x2="19" y2="21" stroke-linecap="round"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 2l8 3.5v6c0 5-3.4 8.7-8 10.5-4.6-1.8-8-5.5-8-10.5v-6L12 2z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c1.3-3.4 4-5.4 7-5.4s5.7 2 7 5.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function renderRoles(){
  var list = document.getElementById('userrole-list');
  if(!list) return;
  var q = document.getElementById('role-search-input').value.trim().toLowerCase();

  var filtered = userRoles.filter(function(r){
    return !q || r.name.toLowerCase().indexOf(q) !== -1 || r.description.toLowerCase().indexOf(q) !== -1;
  });

  list.innerHTML = '';

  if(filtered.length === 0){
    list.innerHTML = '<div class="empty-state">No roles found</div>';
    return;
  }

  filtered.forEach(function(r){
    var idx = userRoles.indexOf(r);
    var card = document.createElement('div');
    card.className = 'role-card';
    card.innerHTML =
      '<div class="role-card-top">' +
        '<span class="role-index">#: ' + r.id + '</span>' +
        '<span class="badge role-tag ' + r.badgeClass + '">' + (roleIconSvgs[r.icon] || '') + r.name + '</span>' +
      '</div>' +
      '<div class="role-meta">' +
        '<div class="meta-block"><span class="meta-label">Role Name</span><span class="meta-value" style="font-size:14.5px;font-weight:700;color:var(--ink);">' + r.name + '</span></div>' +
        '<div class="meta-block"><span class="meta-label">Accounts</span><span class="meta-value" style="font-size:14.5px;font-weight:700;color:var(--ink);">' + r.accounts + ' users</span></div>' +
      '</div>' +
      '<span class="meta-label">Description</span>' +
      '<div class="role-desc-text">' + r.description + '</div>' +
      '<div class="role-actions">' +
        '<button class="pill-btn edit" onclick="openRoleEditModal(' + idx + ')">' +
          '<svg viewBox="0 0 24 24"><path d="M4 20l1-4.5L15.5 5l3.5 3.5L8.5 19 4 20z" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          'Edit' +
        '</button>' +
        '<button class="pill-btn reset" onclick="deleteRole(' + idx + ')">' +
          '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          'Delete' +
        '</button>' +
      '</div>';
    list.appendChild(card);
  });
}

function openRoleCreateModal(){
  document.getElementById('role-create-name').value = '';
  document.getElementById('role-create-badge').value = 'role-agent-tag';
  document.getElementById('role-create-desc').value = '';
  document.getElementById('role-create-modal-overlay').classList.remove('hidden');
}
function closeRoleCreateModal(){
  document.getElementById('role-create-modal-overlay').classList.add('hidden');
}
function confirmCreateRole(){
  var name = document.getElementById('role-create-name').value.trim();
  var badge = document.getElementById('role-create-badge').value;
  var desc = document.getElementById('role-create-desc').value.trim();
  if(!name) return;

  var iconMap = { 'role-superadmin':'crown', 'role-supervisor':'shield', 'role-agent-tag':'user' };

  userRoles.push({
    id: nextRoleId++,
    name: name,
    accounts: 0,
    badgeClass: badge,
    icon: iconMap[badge] || 'user',
    description: desc || 'No description provided.'
  });

  renderRoles();
  closeRoleCreateModal();
  sendPrompt('Create new role ' + name);
}

function openRoleEditModal(idx){
  var r = userRoles[idx];
  if(!r) return;
  currentRoleEditIndex = idx;
  document.getElementById('role-edit-modal-title').textContent = 'Edit Role: ' + r.name;
  document.getElementById('role-edit-name').value = r.name;
  document.getElementById('role-edit-badge').value = r.badgeClass;
  document.getElementById('role-edit-desc').value = r.description;
  document.getElementById('role-edit-modal-overlay').classList.remove('hidden');
}
function closeRoleEditModal(){
  document.getElementById('role-edit-modal-overlay').classList.add('hidden');
}
function confirmRoleEdit(){
  if(currentRoleEditIndex === null) return;
  var r = userRoles[currentRoleEditIndex];
  if(!r) return;

  var name = document.getElementById('role-edit-name').value.trim();
  var badge = document.getElementById('role-edit-badge').value;
  var desc = document.getElementById('role-edit-desc').value.trim();
  if(!name) return;

  var iconMap = { 'role-superadmin':'crown', 'role-supervisor':'shield', 'role-agent-tag':'user' };

  r.name = name;
  r.badgeClass = badge;
  r.icon = iconMap[badge] || 'user';
  r.description = desc || 'No description provided.';

  renderRoles();
  closeRoleEditModal();
  sendPrompt('Save changes for role ' + name);
}

function deleteRole(idx){
  var r = userRoles[idx];
  if(!r) return;
  userRoles.splice(idx, 1);
  renderRoles();
  sendPrompt('Delete role ' + r.name);
}

/* ---- User Accounts ---- */
function getRoleDisplayName(role){
  switch(role.toLowerCase()){
    case 'superadmin': return 'Super Admin';
    case 'supervisor': return 'Supervisor';
    case 'agent': return 'Agent';
    default: return role;
  }
}

function renderUserAccounts(){
  var list = document.getElementById('useraccount-list');
  if(!list) return;
  var q = document.getElementById('useraccount-search-input').value.trim().toLowerCase();

  var filtered = userAccounts.filter(function(u){
    return !q || u.username.toLowerCase().indexOf(q) !== -1 || u.email.toLowerCase().indexOf(q) !== -1;
  });

  list.innerHTML = '';

  if(filtered.length === 0){
    list.innerHTML = '<div class="empty-state">No user accounts found</div>';
    return;
  }

  filtered.forEach(function(u){
    var idx = userAccounts.indexOf(u);
    var card = document.createElement('div');
    card.className = 'useraccount-card';
    card.innerHTML =
      '<div class="useraccount-card-top">' +
        '<div>' +
          '<div class="useraccount-name">' + u.username + '</div>' +
          '<div style="font-size:12px;color:var(--ink-soft);margin-top:3px;">' + u.email + '</div>' +
        '</div>' +
        '<span class="badge ' + statusBadgeClass(u.active ? 'active' : 'inactive') + '">' + (u.active ? 'Active' : 'Inactive') + '</span>' +
      '</div>' +
      '<div class="useraccount-info">' +
        '<div class="meta-block"><span class="meta-label">Role</span><span class="meta-value">' + getRoleDisplayName(u.role) + '</span></div>' +
        '<div class="meta-block"><span class="meta-label">Created</span><span class="meta-value">' + u.createdAt + '</span></div>' +
        '<div class="meta-block"><span class="meta-label">Last Login</span><span class="meta-value">' + u.lastLogin + '</span></div>' +
      '</div>' +
      '<div class="useraccount-actions">' +
        '<button class="pill-btn edit" onclick="openUserAccountEditModal(' + idx + ')">' +
          '<svg viewBox="0 0 24 24"><path d="M4 20l1-4.5L15.5 5l3.5 3.5L8.5 19 4 20z" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          'Edit' +
        '</button>' +
        '<button class="pill-btn reset" onclick="deleteUserAccount(' + idx + ')">' +
          '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          'Delete' +
        '</button>' +
      '</div>';
    list.appendChild(card);
  });
}

function openUserAccountCreateModal(){
  document.getElementById('useraccount-create-username').value = '';
  document.getElementById('useraccount-create-email').value = '';
  document.getElementById('useraccount-create-password').value = '';
  document.getElementById('useraccount-create-confirm-password').value = '';
  document.getElementById('useraccount-create-role').value = 'agent';
  document.getElementById('useraccount-create-active-toggle').classList.add('on');
  document.getElementById('useraccount-create-modal-overlay').classList.remove('hidden');
}
function closeUserAccountCreateModal(){
  document.getElementById('useraccount-create-modal-overlay').classList.add('hidden');
}
function confirmCreateUserAccount(){
  var username = document.getElementById('useraccount-create-username').value.trim();
  var email = document.getElementById('useraccount-create-email').value.trim();
  var password = document.getElementById('useraccount-create-password').value;
  var confirmPassword = document.getElementById('useraccount-create-confirm-password').value;
  var role = document.getElementById('useraccount-create-role').value;
  var active = document.getElementById('useraccount-create-active-toggle').classList.contains('on');

  if(!username || !email || !password || !confirmPassword){
    alert('Please fill in all fields');
    return;
  }

  if(password !== confirmPassword){
    alert('Passwords do not match');
    return;
  }

  userAccounts.push({
    id: nextUserAccountId++,
    username: username,
    email: email,
    role: role,
    roleName: getRoleDisplayName(role),
    active: active,
    createdAt: new Date().toLocaleDateString('en-US'),
    lastLogin: 'Never'
  });

  renderUserAccounts();
  closeUserAccountCreateModal();
  sendPrompt('Create new user account ' + username);
}

function openUserAccountEditModal(idx){
  var u = userAccounts[idx];
  if(!u) return;
  currentUserAccountEditIndex = idx;
  document.getElementById('useraccount-edit-modal-title').textContent = 'Edit User Account: ' + u.username;
  document.getElementById('useraccount-edit-username').textContent = u.username;
  document.getElementById('useraccount-edit-email').value = u.email;
  document.getElementById('useraccount-edit-role').value = u.role;
  document.getElementById('useraccount-edit-active-toggle').classList.toggle('on', !!u.active);
  document.getElementById('useraccount-edit-modal-overlay').classList.remove('hidden');
}
function closeUserAccountEditModal(){
  document.getElementById('useraccount-edit-modal-overlay').classList.add('hidden');
}
function confirmEditUserAccount(){
  if(currentUserAccountEditIndex === null) return;
  var u = userAccounts[currentUserAccountEditIndex];
  if(!u) return;

  var email = document.getElementById('useraccount-edit-email').value.trim();
  var role = document.getElementById('useraccount-edit-role').value;
  var active = document.getElementById('useraccount-edit-active-toggle').classList.contains('on');

  if(!email){
    alert('Email is required');
    return;
  }

  u.email = email;
  u.role = role;
  u.roleName = getRoleDisplayName(role);
  u.active = active;

  renderUserAccounts();
  closeUserAccountEditModal();
  sendPrompt('Save changes for user account ' + u.username);
}

function deleteUserAccount(idx){
  var u = userAccounts[idx];
  if(!u) return;
  userAccounts.splice(idx, 1);
  renderUserAccounts();
  sendPrompt('Delete user account ' + u.username);
}

/* ---- Authorization ---- */
function onAuthRoleSelect(){
  var roleSelector = document.getElementById('auth-role-selector');
  var selectedRole = roleSelector.value;
  if(!selectedRole) return;
  renderAuthPermissions(selectedRole);
}

function renderAuthPermissions(roleName){
  var container = document.getElementById('auth-permissions-container');
  container.innerHTML = '';

  var roleData = authorizationData[roleName];
  if(!roleData) return;

  permissionSections.forEach(function(section){
    var sectionDiv = document.createElement('div');
    sectionDiv.className = 'auth-permission-section';

    var sectionTitle = document.createElement('div');
    sectionTitle.className = 'auth-section-title';
    sectionTitle.innerHTML = '<span class="auth-section-icon">' + section.icon + '</span>' + section.name;
    sectionDiv.appendChild(sectionTitle);

    var perms = roleData.permissions[section.id];

    var rowDiv = document.createElement('div');
    rowDiv.className = 'auth-permission-row';

    var nameSpan = document.createElement('div');
    nameSpan.className = 'auth-permission-name';
    nameSpan.textContent = section.name;
    rowDiv.appendChild(nameSpan);

    var colsDiv = document.createElement('div');
    colsDiv.className = 'auth-permission-cols';

    permissionActions.forEach(function(act){
      var actKey = act.toLowerCase();
      var isChecked = perms[actKey] || false;

      var colDiv = document.createElement('div');
      colDiv.style.display = 'flex';
      colDiv.style.flexDirection = 'column';
      colDiv.style.alignItems = 'center';

      var checkbox = document.createElement('div');
      checkbox.className = 'auth-permission-checkbox' + (isChecked ? ' checked' : '');
      checkbox.setAttribute('data-role', roleName);
      checkbox.setAttribute('data-section', section.id);
      checkbox.setAttribute('data-action', actKey);
      checkbox.onclick = function(){
        toggleAuthPermission(this);
      };
      colDiv.appendChild(checkbox);

      var label = document.createElement('div');
      label.className = 'auth-permission-label';
      label.textContent = act;
      colDiv.appendChild(label);

      colsDiv.appendChild(colDiv);
    });

    rowDiv.appendChild(colsDiv);
    sectionDiv.appendChild(rowDiv);

    container.appendChild(sectionDiv);
  });

  var saveBtn = document.createElement('button');
  saveBtn.className = 'auth-save-btn';
  saveBtn.textContent = 'Save Permissions';
  saveBtn.onclick = function(){
    saveAuthPermissions(roleName);
  };
  container.appendChild(saveBtn);
}

function toggleAuthPermission(checkbox){
  checkbox.classList.toggle('checked');
}

function saveAuthPermissions(roleName){
  var roleData = authorizationData[roleName];
  if(!roleData) return;

  var checkboxes = document.querySelectorAll('.auth-permission-checkbox[data-role="' + roleName + '"]');

  checkboxes.forEach(function(cb){
    var section = cb.getAttribute('data-section');
    var action = cb.getAttribute('data-action');
    var isChecked = cb.classList.contains('checked');

    if(!roleData.permissions[section]){
      roleData.permissions[section] = {};
    }
    roleData.permissions[section][action] = isChecked;
  });

  sendPrompt('Authorization permissions saved for ' + roleData.name);
}

/* ---- Change Password ---- */
function togglePasswordVisibility(inputId){
  var input = document.getElementById(inputId);
  if(!input) return;
  if(input.type === 'password'){
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}
