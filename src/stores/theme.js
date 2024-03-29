import {defineStore} from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(true);
  const setTheme = () => {
    theme.value = !theme.value;
  }

  return {setTheme, theme}
})