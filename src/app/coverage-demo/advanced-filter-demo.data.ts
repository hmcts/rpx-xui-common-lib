import { FilterFieldConfig, FilterSetting, GroupOptions } from 'projects/exui-common-lib/src/public-api';

const skillGroups: GroupOptions[] = [
  { group: 'family', options: [{ key: '201', label: 'Hearings' }] },
  { group: 'civil', options: [{ key: '102', label: 'Case preparation' }, { key: '101', label: 'Appeals' }] }
];

export function advancedFilterFields(contract: string): FilterFieldConfig[] {
  switch (contract) {
    case 'persistence':
      return [{
        name: 'categories', title: 'Categories', type: 'checkbox', minSelected: 0, maxSelected: 0,
        options: [{ key: 'family', label: 'Family category' }]
      }];
    case 'choices':
    case 'limits':
      return [{
        name: 'categories', title: 'Categories', type: 'checkbox-large', minSelected: 0,
        maxSelected: contract === 'limits' ? 1 : 0,
        maxSelectedError: 'Choose at most one category', displayMaxSelectedError: true,
        options: [
          ...(contract === 'choices' ? [{ key: 'all', label: 'All categories', selectAll: true }] : []),
          { key: 'civil', label: 'Civil category' }, { key: 'family', label: 'Family category' }
        ]
      }];
    case 'text':
      return [
        {
          name: 'name', title: 'Name', type: 'text-input', minSelected: 3, maxSelected: 0, options: [],
          minSelectedError: 'Enter at least three characters', displayMinSelectedError: true
        },
        {
          name: 'email', title: 'Email', type: 'email-input', minSelected: 1, maxSelected: 0, options: [],
          minSelectedError: 'Enter an email', displayMinSelectedError: true, emailError: 'Enter a valid email'
        }
      ];
    case 'groups':
    case 'nested':
      return [
        {
          name: 'user-services', title: 'Services', type: 'checkbox', minSelected: 0, maxSelected: 0,
          options: [{ key: 'civil', label: 'Civil service' }, { key: 'family', label: 'Family service' }]
        },
        {
          name: 'user-skills', title: 'Skills', type: contract === 'groups' ? 'group-select' : 'nested-checkbox',
          minSelected: 0, maxSelected: 0, options: [], groupOptions: skillGroups, disabledText: 'Choose a skill'
        }
      ];
    default:
      return [
        {
          name: 'include', title: 'Include details', type: 'radio', minSelected: 0, maxSelected: 0,
          options: [{ key: 'no', label: 'No detail' }, { key: 'yes', label: 'Include detail' }]
        },
        {
          name: 'detail', title: 'Detail', type: 'text-input', minSelected: 0, maxSelected: 0, options: [],
          showCondition: 'include=yes', minSelectedError: 'Enter a detail', displayMinSelectedError: true
        }
      ];
  }
}

export function advancedFilterDefaults(contract: string, id: string, configuredTextDefaults = false): FilterSetting {
  if (configuredTextDefaults) {
    return {
      id,
      fields: [{ name: 'name', value: ['Default reviewer'] }, { name: 'email', value: ['default@example.test'] }]
    };
  }
  return {
    id,
    fields: contract === 'conditional'
      ? [{ name: 'include', value: ['no'] }, { name: 'detail', value: [''] }]
      : contract === 'choices' ? [{ name: 'categories', value: ['civil'] }] : []
  };
}
