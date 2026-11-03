export const messageCookie = 'commonlib-lifecycle-hidden-messages';
export const firstEnglishMessage = 'English <strong>planned maintenance</strong> is available.<script>window.__unsafeEnglish = true</script>';
export const secondEnglishMessage = 'English unaffected service message.';
export const lifecycleClock = new Date('2026-10-13T12:00:00Z');

export const lifecycleRoles = [
  { role: 'caseworker-divorce', headings: ['Divorce service notice', 'Shared service notice'] },
  { role: 'caseworker-probate', headings: ['Probate service notice', 'Shared service notice'] },
  { role: 'caseworker-civil', headings: [] },
  { role: 'none', headings: [] }
];

export const lifecycleDateErrors = [
  { set: 'invalid-start', message: 'Invalid start date. Message index: 30' },
  { set: 'invalid-end', message: 'Invalid end date. Message index: 31' },
  { set: 'inverted', message: 'The start date is greater than the end date. Message index: 32' }
];

export const standaloneMessageKey = {
  index: 40,
  roles: '.+',
  message_en: '<strong>Safe English notice</strong> <a href="/coverage">Read service details</a><script>void 0</script><a href="javascript:void(0)" onclick="void 0">Unsafe link fixture</a>',
  message_cy: '<em>Hysbysiad Cymraeg</em><script>void 0</script>'
};
