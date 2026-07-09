var players = {
  'APXvirak': {
    username:'APXvirak', email:'N/A', phone:'N/A', status:'Active',
    balance:60.57, createdAt:'6/22/2026, 10:47:35 AM',
    breadcrumbParent:'AAABBBMMAA',
    transactions:[
      { from:'AAABBBMM', to:'APXvirak', type:'Deposit', amount:10.00, date:'6/30/2026, 10:03:30 AM' }
    ]
  },
  'APXtest123': {
    username:'APXtest123', email:'N/A', phone:'N/A', status:'Active',
    balance:495.00, createdAt:'6/18/2026, 2:11:04 PM',
    breadcrumbParent:'AAABBBMMAA',
    transactions:[
      { from:'AAABBBMM', to:'APXtest123', type:'Deposit', amount:495.00, date:'6/18/2026, 2:12:40 PM' }
    ]
  },
  'AAABBBMMAAT12': {
    username:'AAABBBMMAAT12', email:'N/A', phone:'N/A', status:'Active',
    balance:0, createdAt:'6/10/2026, 9:20:15 AM',
    breadcrumbParent:'AAABBBMMAA',
    transactions:[]
  }
};

var subAccounts = {
  'DDD@AAABBBMM': {
    username:'DDD@AAABBBMM', role:'Master', status:'Active',
    balance:0, createdAt:'N/A',
    transactions:[]
  },
  'test@AAABBBMM': {
    username:'test@AAABBBMM', role:'Master', status:'Active',
    balance:0, createdAt:'N/A',
    transactions:[]
  }
};

var bankAccounts = [
  { bank:'ACLEDA', accountName:'TestName', accountNumber:'33333222', group:'VIP', status:'Active', isDefault:false, logoColor:'#16305c', logoInitial:'A' },
  { bank:'ABA', accountName:'DDDCC', accountNumber:'1234234234', group:'VIP', status:'Active', isDefault:true, logoColor:'#16305c', logoInitial:'ABA' }
];

var depositRequests = [
  {
    id:'dep-1', player:'APXkps', amount:10000.00,
    depositedTo:'ABA - DDDCC (1234234234)',
    playerBank:'ABA - Test (1112121212312)',
    txnRef:'Testdfsda', proof:'N/A',
    status:'Pending', submittedAt:'7/5/2026, 11:06:14 AM'
  }
];

var withdrawalRequests = [
  {
    id:'wd-1', player:'APXtest123', amount:100.00,
    withdrawTo:'ABA - 123 (123)',
    status:'Pending', submittedAt:'7/2/2026, 12:05:31 PM'
  },
  {
    id:'wd-2', player:'APXvirak', amount:10.00,
    withdrawTo:'ABA - Virak (123445)',
    status:'Pending', submittedAt:'6/30/2026, 2:14:45 PM'
  }
];

var globalTransactions = [
  { from:'AAABBBMM', to:'APXkps', type:'Deposit', amount:100.00, date:'7/5/2026, 11:08:18 AM', dateISO:'2026-07-05' },
  { from:'APXtest123', to:'AAABBBMM', type:'Withdraw', amount:5.00, date:'7/2/2026, 12:04:59 PM', dateISO:'2026-07-02' },
  { from:'AAABBBMM', to:'APXtest123', type:'Deposit', amount:300.00, date:'7/2/2026, 12:02:47 PM', dateISO:'2026-07-02' },
  { from:'AAABBBMM', to:'APXtest123', type:'Deposit', amount:200.00, date:'7/2/2026, 12:02:43 PM', dateISO:'2026-07-02' },
  { from:'AAABBBMM', to:'APXvirak', type:'Deposit', amount:10.00, date:'6/30/2026, 10:03:30 AM', dateISO:'2026-06-30' }
];

var winLossReportData = [
  { date:'7/5/2026', betCount:1, turnover:2.50, win:0.00, winLoss:-2.50 },
  { date:'7/3/2026', betCount:45, turnover:34.47, win:0.00, winLoss:8.07 },
  { date:'6/30/2026', betCount:3, turnover:52.50, win:0.00, winLoss:42.50 }
];

var userRoles = [
  {
    id:1, name:'Super Admin', accounts:2, badgeClass:'role-superadmin', icon:'crown',
    description:'Full system access. Manages all modules and settings.'
  },
  {
    id:2, name:'Supervisor', accounts:4, badgeClass:'role-supervisor', icon:'shield',
    description:'Oversees agents. Can view reports and approve actions.'
  },
  {
    id:3, name:'Agent', accounts:8, badgeClass:'role-agent-tag', icon:'user',
    description:'Handles client follow-up, bonuses, and daily operations.'
  }
];
var nextRoleId = 4;
var currentRoleEditIndex = null;

var userAccounts = [
  {
    id:1, username:'admin', email:'admin@sbo24.com', role:'superadmin', roleName:'Super Admin',
    active:true, createdAt:'6/1/2026', lastLogin:'7/8/2026, 2:15 PM'
  },
  {
    id:2, username:'supervisor1', email:'supervisor@sbo24.com', role:'supervisor', roleName:'Supervisor',
    active:true, createdAt:'6/15/2026', lastLogin:'7/7/2026, 5:30 PM'
  },
  {
    id:3, username:'agent1', email:'agent1@sbo24.com', role:'agent', roleName:'Agent',
    active:true, createdAt:'7/1/2026', lastLogin:'7/6/2026, 11:00 AM'
  },
  {
    id:4, username:'agent2', email:'agent2@sbo24.com', role:'agent', roleName:'Agent',
    active:false, createdAt:'7/2/2026', lastLogin:'7/5/2026, 3:45 PM'
  }
];
var nextUserAccountId = 5;
var currentUserAccountEditIndex = null;

var authorizationData = {
  superadmin: {
    name: 'Super Admin',
    permissions: {
      client: { view: true, add: true, edit: true, del: true },
      followup: { view: true, add: true, edit: true, del: true },
      marketing: { view: true, add: true, edit: true, del: true },
      setup: { view: true, add: true, edit: true, del: true },
      security: { view: true, add: true, edit: true, del: true }
    }
  },
  supervisor: {
    name: 'Supervisor',
    permissions: {
      client: { view: true, add: true, edit: true, del: false },
      followup: { view: true, add: true, edit: true, del: false },
      marketing: { view: true, add: false, edit: false, del: false },
      setup: { view: true, add: false, edit: false, del: false },
      security: { view: true, add: false, edit: false, del: false }
    }
  },
  agent: {
    name: 'Agent',
    permissions: {
      client: { view: true, add: false, edit: false, del: false },
      followup: { view: true, add: true, edit: false, del: false },
      marketing: { view: false, add: false, edit: false, del: false },
      setup: { view: false, add: false, edit: false, del: false },
      security: { view: false, add: false, edit: false, del: false }
    }
  }
};

var permissionSections = [
  { id: 'client', name: 'CLIENT', icon: '👥' },
  { id: 'followup', name: 'FOLLOW UP & BONUS', icon: '🎁' },
  { id: 'marketing', name: 'MARKETING', icon: '📢' },
  { id: 'setup', name: 'SETUP', icon: '⚙️' },
  { id: 'security', name: 'SECURITY', icon: '🔒' }
];

var permissionActions = ['VIEW', 'ADD', 'EDIT', 'DEL'];

/* Global state variables */
var currentAccount = null;
var currentAccountKind = null;
var topupSelectedAmount = 0;
var subaccountStatusTarget = null;
