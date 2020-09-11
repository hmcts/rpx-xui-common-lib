export interface User {
    [key: string]: any;
    routerLink?: string;
    routerLinkTitle?: string;
    fullName?: string;
    email?: string;
    status?: string;
    resendInvite?: boolean;
}
