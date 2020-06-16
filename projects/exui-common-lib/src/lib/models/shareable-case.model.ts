import { BasicUser } from './basic-user.model';

export interface ShareableCase {
    [key: string]: any;
    id: string;
    users?: BasicUser[];
}
