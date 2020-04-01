export class AnonymousFeatureUser {
    public anonymous: true;
}

export class LoggedInFeatureUser {
    public key: string;
    public custom: {
        [key: string]: any,
        roles: string[],
        orgId: string
    };
}

export type FeatureUser = AnonymousFeatureUser | LoggedInFeatureUser;
