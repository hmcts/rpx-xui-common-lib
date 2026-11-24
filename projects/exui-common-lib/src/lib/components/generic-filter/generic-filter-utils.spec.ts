import { FormControl } from '@angular/forms';
import { FilterConfigOption } from '../../models';
import { getValues, maxSelectedValidator, minSelectedValidator } from './generic-filter-utils';

describe('generic-filter-utils', () => {
  const options: FilterConfigOption[] = [
    { key: 'IA', label: 'Immigration and Asylum' },
    { key: 'CIVIL', label: 'Civil' },
    { key: 'SSCS', label: 'Social Security and Child Support' }
  ];

  describe('minSelectedValidator', () => {
    it('accepts a populated value at the minimum', () => {
      const validator = minSelectedValidator<string>(2);

      expect(validator(new FormControl(['IA', 'CIVIL']))).toBeNull();
    });

    it('rejects an empty value and values below the minimum', () => {
      const validator = minSelectedValidator<string>(2);

      expect(validator(new FormControl([]))).toEqual({ minlength: true });
      expect(validator(new FormControl(['IA']))).toEqual({ minlength: true });
    });

    it('counts only truthy selected values', () => {
      const validator = minSelectedValidator<string>(2);

      expect(validator(new FormControl(['IA', null, 'CIVIL']))).toBeNull();
      expect(validator(new FormControl(['IA', null]))).toEqual({ minlength: true });
    });
  });

  describe('maxSelectedValidator', () => {
    it('accepts a populated value at the maximum', () => {
      const validator = maxSelectedValidator<string>(2);

      expect(validator(new FormControl(['IA', 'CIVIL']))).toBeNull();
    });

    it('rejects values above the maximum', () => {
      const validator = maxSelectedValidator<string>(2);

      expect(validator(new FormControl(['IA', 'CIVIL', 'SSCS']))).toEqual({ maxLength: true });
    });
  });

  describe('getValues', () => {
    it('returns option keys at truthy value indexes', () => {
      expect(getValues(options, [true, false, true])).toEqual(['IA', 'SSCS']);
    });

    it('omits falsey indexes and ignores values without an option', () => {
      expect(getValues(options, [false, 0, undefined, true])).toEqual([]);
      expect(getValues(options, [])).toEqual([]);
    });
  });
});
