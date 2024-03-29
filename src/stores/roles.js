import {defineStore} from 'pinia';
import { ref } from 'vue';

export const useRolesStore = defineStore('roles', () => {
  const role = ref("GUEST")
  return {role}
})