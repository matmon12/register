import { defineAbility } from '@casl/ability';
import { AbilityBuilder, createMongoAbility } from '@casl/ability'

export const ability = createMongoAbility();

export function defineAbilityFor(role) {
  const {rules, can, cannot} = new AbilityBuilder(createMongoAbility);

  switch (role) {
    case 'GUEST':
      cannot('visit', 'Dashboard');
      break;
    case 'USER':
      cannot('visit', 'Dashboard');
      can('create', 'Post');
      can('delete', 'Post');
      break;
    case 'ADMIN':
      can('visit', 'Dashboard');
      can('create', 'Post');
      can('delete', 'Post');
      can('update', 'Post');
      break;
    default:
       break;
  }

  return rules;
}
