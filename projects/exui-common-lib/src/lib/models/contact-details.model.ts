import { BadgeColour } from './badge-colour.model';

export interface ContactDetailsDataModel {
    title?: string;
    badgeColour?: BadgeColour;
    badgeText?: string;
    email?: string;
    phone?: string;
    openingTimes?: string;
}
