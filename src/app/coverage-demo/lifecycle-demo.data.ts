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
