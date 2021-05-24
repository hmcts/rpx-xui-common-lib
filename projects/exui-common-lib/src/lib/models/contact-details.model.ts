export enum BadgeColour {
  BADGE_RED = 'hmcts-badge--red',
  BADGE_BLUE = 'hmcts-badge--blue',
  BADGE_GREEN = 'hmcts-badge--green',
}

export interface ContactDetailsDataModel {
    title?: string;
    badgeColour?: BadgeColour;
    badgeText?: string;
    email?: string;
    phone?: string;
    openingTimes?: string;
}
