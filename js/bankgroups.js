var bankGroups = ['VIP'];
var currentGroupEditIndex = null;

function renderBankGroups(){
  var list = document.getElementById('bankgroups-list');
  list.innerHTML = '';
  bankGroups.forEach(function(name, idx){
    var row = document.createElement('div');
    row.className = 'group-row';
    row.innerHTML =
      '<span class="group-name">' + name + '</span>' +
      '<div class="group-actions">' +
        '<button class="mini-btn edit-mini" onclick="openGroupEditModal(' + idx + ')">' +
          '<svg viewBox="0 0 24 24"><path d="M4 20l1-4.5L15.5 5l3.5 3.5L8.5 19 4 20z" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
        '<button class="mini-btn delete-mini" onclick="deleteBankGroup(' + idx + ')">' +
          '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
      '</div>';
    list.appendChild(row);
  });
}

function openGroupCreateModal(){
  document.getElementById('group-create-name').value = '';
  document.getElementById('group-create-modal-overlay').classList.remove('hidden');
}
function closeGroupCreateModal(){
  document.getElementById('group-create-modal-overlay').classList.add('hidden');
}
function confirmCreateGroup(){
  var name = document.getElementById('group-create-name').value.trim();
  if(!name) return;
  bankGroups.push(name);
  renderBankGroups();
  closeGroupCreateModal();
  sendPrompt('Create new bank group ' + name);
}

function openGroupEditModal(idx){
  currentGroupEditIndex = idx;
  document.getElementById('group-edit-name').value = bankGroups[idx];
  document.getElementById('group-edit-modal-overlay').classList.remove('hidden');
}
function closeGroupEditModal(){
  document.getElementById('group-edit-modal-overlay').classList.add('hidden');
}
function confirmGroupEdit(){
  if(currentGroupEditIndex === null) return;
  var name = document.getElementById('group-edit-name').value.trim();
  if(!name) return;
  var oldName = bankGroups[currentGroupEditIndex];
  bankGroups[currentGroupEditIndex] = name;
  renderBankGroups();
  closeGroupEditModal();
  sendPrompt('Rename bank group ' + oldName + ' to ' + name);
}

function deleteBankGroup(idx){
  var removed = bankGroups[idx];
  bankGroups.splice(idx, 1);
  renderBankGroups();
  sendPrompt('Delete bank group ' + removed);
}
