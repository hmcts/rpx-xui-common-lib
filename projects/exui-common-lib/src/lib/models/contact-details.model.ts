export enum BadgeColour {
  BADGE_RED = 'govuk-tag--red',
  BADGE_BLUE = 'govuk-tag--blue',
  BADGE_GREEN = 'govuk-tag--green',
}

export interface ContactDetailsDataModel {
    title?: string;
    badgeColour?: BadgeColour;
    badgeText?: string;
    email?: string;
    phone?: string;
    openingTimes?: string;
    contactDetails?: {
      name: string;
      contactLink: string;
    }
}
