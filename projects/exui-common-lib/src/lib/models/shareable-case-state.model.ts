import { BasicUser } from './basic-user.model';
import { ShareableCase } from './shareable-case.model';

export interface ShareableCaseState {
    case: ShareableCase;
    addedUsers: BasicUser[];
    removedUsers: BasicUser[];
}
