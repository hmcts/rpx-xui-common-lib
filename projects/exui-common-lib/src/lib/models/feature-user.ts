export class AnonymousFeatureUser {
    public anonymous: true;
}

export class LoggedInFeatureUser {
    public key: string;
}

export type FeatureUser = AnonymousFeatureUser | LoggedInFeatureUser;
