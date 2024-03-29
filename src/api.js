import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useAuthGoogleStore } from "@/stores/authGoogle";
import { useAuthPhoneStore } from "@/stores/authPhone";
import router from "./router/router";

const axiosApiInstance = axios.create();
const apiKey = import.meta.env.VITE_API_KEY_FIREBASE;


axiosApiInstance.interceptors.request.use((config) => {
  const url = config.url;
  if (!url.includes("signInWithPassword") && !url.includes("signUp")) {
    const authStore = useAuthStore();
    const authGoogleStore = useAuthGoogleStore();
    const authPhoneStore = useAuthPhoneStore();
    const currentToken = authStore.userInfo.token || authGoogleStore.userInfo.token || authPhoneStore.userTokens.token;
    let params = new URLSearchParams();
    params.append("auth", currentToken);
    config.params = params;
  }
  return config;
});

axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const authStore = useAuthStore();
    const authPhoneStore = useAuthPhoneStore();
    const authGoogleStore = useAuthGoogleStore();

    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = false;
      try {
        if(localStorage.getItem("userTokens")){
          const newTokens = await axios.post(
            `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
            {
              grant_type: "refresh_token",
              refresh_token: JSON.parse(localStorage.getItem("userTokens")).refreshToken,
            }
          );
          authStore.userInfo.token = newTokens.data.access_token;
          authStore.userInfo.refreshToken = newTokens.data.refresh_token;
          localStorage.setItem(
            "userTokens",
            JSON.stringify({
              token: newTokens.data.access_token,
              refreshToken: newTokens.data.refresh_token,
            })
          );
        }
        if(localStorage.getItem("phoneTokens")){
          const newTokens = await axios.post(
            `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
            {
              grant_type: "refresh_token",
              refresh_token: JSON.parse(localStorage.getItem("phoneTokens")).refreshToken,
            }
          );
          authPhoneStore.userTokens.token = newTokens.data.access_token;
          authPhoneStore.userTokens.refreshToken = newTokens.data.refresh_token;
          localStorage.setItem(
            "phoneTokens",
            JSON.stringify({
              token: newTokens.data.access_token,
              refreshToken: newTokens.data.refresh_token,
            })
          );
        }
        if(localStorage.getItem("userWithGoogle")) {
          const newTokens = await axios.post(
            `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
            {
              grant_type: "refresh_token",
              refresh_token: JSON.parse(localStorage.getItem("userWithGoogle")).refreshToken,
            }
          );
          authGoogleStore.userInfo.token = newTokens.data.access_token;
          authGoogleStore.userInfo.refreshToken = newTokens.data.refresh_token;
          localStorage.setItem(
            "userWithGoogle",
            JSON.stringify({
              token: newTokens.data.access_token,
              refreshToken: newTokens.data.refresh_token,
            })
          );
        }
      } catch (err) {
        localStorage.removeItem("userTokens");
        localStorage.removeItem("phoneTokens");
        localStorage.removeItem("userWithGoogle");
        router.push("/register/signin");
        authStore.userInfo.token = "";
        authStore.userInfo.refreshToken = "";
        authPhoneStore.userTokens.token = "";
        authPhoneStore.userTokens.refreshToken = "";
        authGoogleStore.userInfo.token = "";
        authGoogleStore.userInfo.refreshToken = "";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosApiInstance;
