// Independent expected records: do not import the host's synthetic seed.
export const expectedSelectedUser = {
  fullName: 'Demo User 51', email: 'user51@example.test', status: 'Active',
  routerLink: '/coverage/users/user-51', routerLinkTitle: 'View Demo User 51',
  manageOrganisations: 'No', manageUsers: 'Yes', manageCases: 'Yes', roles: ['pui-caa'], resendInvite: false
};

export const expectedSuspendedUser = {
  fullName: 'Demo User 1', email: 'user1@example.test', status: 'Active',
  routerLink: '/coverage/users/user-1', routerLinkTitle: 'View Demo User 1',
  manageOrganisations: 'No', manageUsers: 'Yes', manageCases: 'Yes', roles: ['pui-caa'], resendInvite: false
};

export const expectedInvitedUser = {
  fullName: 'Invited Demo User', email: 'invited@example.test', status: 'Pending', resendInvite: true
};
