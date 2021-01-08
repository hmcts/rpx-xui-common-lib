import { RoleService } from './role.service';

describe('Role Service', () => {
    it('Initializes with no roles', () => {
        const service = new RoleService();
        expect(service.roles.length).toEqual(0);
    });

    it('Stores the roles that are set', () => {
        const service = new RoleService();
        service.roles = ['a', 'b', 'c'];
        expect(service.roles.length).toEqual(3);
        expect(service.roles[0]).toEqual('a');
    });
});
