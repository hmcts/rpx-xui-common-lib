import { Observable } from 'rxjs';

export abstract class FeatureToggleService {
    public abstract isEnabled(feature: string): Observable<boolean>;
}
