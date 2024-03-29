import { ref } from "vue";
import { defineStore } from "pinia";
import * as VKID from "@vkid/sdk";

export const useAuthVKStore = defineStore("authVK", () => {
  var email = ref('');
  var accessToken = ref('');

  VKID.Config.set({
    app: 51874811,
    redirectUrl: "https://localhost:443/register/signin",
  });

  const signupVK = () => {
    VKID.Auth.login();
  };
  
  const logout = () => {
    accessToken.value = '';
  }

  return {signupVK, email, accessToken, logout}
})