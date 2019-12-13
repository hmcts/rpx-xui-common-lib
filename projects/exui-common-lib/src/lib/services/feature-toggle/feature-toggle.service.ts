import { Observable } from 'rxjs';
import { FeatureUser } from '../../models/feature-user';

export abstract class FeatureToggleService {
    public abstract initialize(user: FeatureUser): void;
    public abstract isEnabled(feature: string): Observable<boolean>;
}
