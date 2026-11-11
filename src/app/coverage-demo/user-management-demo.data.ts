import { User } from 'projects/exui-common-lib/src/lib/models';

export const managementUsers: User[] = Array.from({ length: 51 }, (_, index) => ({
  fullName: `Demo User ${index + 1}`,
  email: `user${index + 1}@example.test`,
  status: 'Active',
  routerLink: `/coverage/users/user-${index + 1}`,
  routerLinkTitle: `View Demo User ${index + 1}`,
  manageOrganisations: 'No',
  manageUsers: 'Yes',
  manageCases: 'Yes',
  roles: ['pui-caa'],
  resendInvite: false
}));

export const invitedUser: User = {
  fullName: 'Invited Demo User', email: 'invited@example.test', status: 'Pending', resendInvite: true
};
