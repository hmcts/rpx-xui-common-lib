import { ServiceMessages } from 'projects/exui-common-lib/src/lib/models/service-message.model';

export const lifecycleMessageKey = 'commonlib-lifecycle-messages';
export const lifecycleMessageCookie = 'commonlib-lifecycle-hidden-messages';
export const initialFeatureKey = 'commonlib-lifecycle-alpha';
export const reboundFeatureKey = 'commonlib-lifecycle-beta';

export const lifecycleMessages: ServiceMessages[] = [
  {
    index: 1,
    roles: 'caseworker-demo',
    message_en: 'English <strong>planned maintenance</strong> is available.<script>window.__unsafeEnglish = true</script>',
    message_cy: 'Mae <strong>gwaith cynnal a chadw</strong> ar gael.<script>window.__unsafeWelsh = true</script>'
  },
  {
    index: 2,
    roles: 'caseworker-demo',
    message_en: 'English unaffected service message.',
    message_cy: 'Neges gwasanaeth Gymraeg heb ei heffeithio.'
  }
];

const lifecycleNow = '2026-10-13T12:00:00Z';

export const lifecycleMessageSets: Record<string, ServiceMessages[]> = {
  default: lifecycleMessages,
  isolated: [lifecycleMessages[0]],
  roles: [
    { index: 1, roles: '^caseworker-divorce$', message_en: 'Divorce service notice', message_cy: '' },
    { index: 2, roles: '^caseworker-probate$', message_en: 'Probate service notice', message_cy: '' },
    { index: 3, roles: '^caseworker-(divorce|probate)$', message_en: 'Shared service notice', message_cy: '' }
  ],
  dates: [
    { index: 10, roles: '.+', message_en: 'Active dated notice', message_cy: '', begin: '2026-10-12T12:00:00Z', end: '2026-10-14T12:00:00Z' },
    { index: 11, roles: '.+', message_en: 'Future notice', message_cy: '', begin: '2026-10-14T12:00:00Z' },
    { index: 12, roles: '.+', message_en: 'Expired notice', message_cy: '', end: '2026-10-12T12:00:00Z' },
    { index: 13, roles: '.+', message_en: 'Undated notice', message_cy: '' },
    { index: 14, roles: '.+', message_en: 'No start date notice', message_cy: '', end: '2026-10-14T12:00:00Z' },
    { index: 15, roles: '.+', message_en: 'No end date notice', message_cy: '', begin: '2026-10-12T12:00:00Z' },
    { index: 16, roles: '.+', message_en: 'Starts exactly now', message_cy: '', begin: lifecycleNow },
    { index: 17, roles: '.+', message_en: 'Ends exactly now', message_cy: '', end: lifecycleNow }
  ],
  wildcard: [{ index: 20, roles: '.+', message_en: 'Notice for everyone', message_cy: '' }],
  'invalid-start': [{ index: 30, roles: '.+', message_en: 'Invalid start fixture', message_cy: '', begin: 'not-a-date' }],
  'invalid-end': [{ index: 31, roles: '.+', message_en: 'Invalid end fixture', message_cy: '', end: 'not-a-date' }],
  inverted: [{ index: 32, roles: '.+', message_en: 'Inverted interval fixture', message_cy: '', begin: '2026-10-14T12:00:00Z', end: '2026-10-12T12:00:00Z' }]
};

export const lifecycleStandaloneMessage: ServiceMessages = {
  index: 40,
  roles: '.+',
  message_en: '<strong>Safe English notice</strong> <a href="/coverage">Read service details</a><script>void 0</script><a href="javascript:void(0)" onclick="void 0">Unsafe link fixture</a>',
  message_cy: '<em>Hysbysiad Cymraeg</em><script>void 0</script>'
};
