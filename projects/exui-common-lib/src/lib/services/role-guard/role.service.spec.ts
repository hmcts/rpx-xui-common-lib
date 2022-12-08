import { take } from 'rxjs/operators';
import { RoleService } from './role.service';

describe('Role Service', () => {
    it('Initializes with roles as null', () => {
        const service = new RoleService();
        expect(service.pRoles.getValue()).toEqual(null);
    });

    it('Stores the roles that are set', () => {
        const service = new RoleService();
        service.roles = ['a', 'b', 'c'];
        expect(service.pRoles.getValue().length).toEqual(3);
        expect(service.pRoles.getValue()[0]).toEqual('a');
    });

    it('Gets roles from observable', () => {
       const service = new RoleService();
       service.roles = ['a', 'b', 'c'];
       service.roles$.pipe(take(1)).subscribe(roles => {
         expect(roles.length).toEqual(3);
         expect(roles[0]).toEqual('a');
       });
  });
});
