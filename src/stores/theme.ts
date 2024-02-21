import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkMode: localStorage.getItem('darkMode') === 'true' ? true as boolean : false as boolean
  }),
  actions: {
    getTheme() {
      return this.darkMode
    },
    setTheme(value: boolean) {
      value ? localStorage.setItem('darkMode', 'true') : localStorage.setItem('darkMode', 'false');
    }
  }
})