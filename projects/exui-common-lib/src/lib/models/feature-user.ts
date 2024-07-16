export class AnonymousFeatureUser {
  public anonymous: true;
}

export class LoggedInFeatureUser {
  public key: string;
  [key: string]: any;
  public roles: string[];
  public orgId: string;
}

export type FeatureUser = AnonymousFeatureUser | LoggedInFeatureUser;
