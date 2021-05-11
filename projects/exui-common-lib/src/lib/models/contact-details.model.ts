import { BadgeColour } from "./badge-colour.enum";

export interface ContactDetailsDataModel {
    title?: string;
    badgeColour?: BadgeColour;
    badgeText?: string;
    email?: string;
    phone?: string;
    openingTimes?: string;
}
