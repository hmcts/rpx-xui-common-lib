export const primitiveCheckboxes = [
  { id: 'email-alerts', value: 'email', label: 'Email alerts' },
  { id: 'sms-alerts', value: 'sms', label: 'SMS alerts' }
];

export const primitiveRadios = [
  { id: 'routine-radio', name: 'urgency', value: 'routine', label: 'Routine' },
  { id: 'urgent-radio', name: 'urgency', value: 'urgent', label: 'Urgent' }
];

export const primitiveTableRows = [
  { caseId: 'Case 1001', opened: new Date(2024, 0, 7), status: 'Open', routerLink: ['/home'] },
  { caseId: 'Case 1002', opened: new Date(2024, 1, 14), status: 'Closed', routerLink: ['/home'] }
];

export const primitivePaginationRecords = [
  'Record 1', 'Record 2', 'Record 3', 'Record 4', 'Record 5'
];
