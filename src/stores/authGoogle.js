import { ref } from "vue";
import { defineStore } from "pinia";
import { useToast } from "primevue/usetoast";
import axiosApiInstance from "../api";
import { getDatabase, ref as firebaseRef, set } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithRedirect,
  onAuthStateChanged,
} from "firebase/auth";
import { useAuthStore } from "./auth";

export const useAuthGoogleStore = defineStore("authGoogle", () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const toast = useToast();
  const authStore = useAuthStore();

  const userInfo = ref({
    token: "",
    refreshToken: "",
    userName: "",
    userEmail: "",
    avatar: "",
  });
  const error = ref("");
  const loader = ref(false);

  const signupWithGoogle = async () => {
    error.value = "";
    loader.value = true;

    // провайдер
    authStore.provider = 'google.com';
    localStorage.setItem("provider", JSON.stringify(authStore.provider));

    await signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        userInfo.value = {
          token: result.user.accessToken,
          refreshToken: result.user.refreshToken,
        };

        localStorage.setItem(
          "userWithGoogle",
          JSON.stringify({
            token: userInfo.value.token,
            refreshToken: userInfo.value.refreshToken,
          })
        );

        if (result._tokenResponse.isNewUser) {
          writeUserData(result.user.uid, "USER");
        }
      })
      .catch((err) => {
        console.log(err.code);
        switch (err.code) {
          case "auth/cancelled-popup-request":
            error.value = "Открытие окна было отменено пользоватем!";
            break;
          case "auth/popup-closed-by-user":
            error.value = "Окно было закрыто пользователем!";
            break;
          case "auth/popup-blocked":
            error.value = "Окно было заблокировано браузером!";
            break;
          default:
            error.value = "Произошла ошибка при аутентификации через Google!";
        }
        throw error.value;
      })
      .finally(() => {
        loader.value = false;
      });
  };

  const writeUserData = async (userId, role) => {
    const db = getDatabase();
    await set(firebaseRef(db, "users/" + userId), {
      id: userId,
      role: role,
    });
  };

  const logout = () => {
    userInfo.value = {
      token: "",
      refreshToken: "",
    };
  };

  return { signupWithGoogle, logout, userInfo, error, loader };
});
