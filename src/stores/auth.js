import { ref } from "vue";
import { defineStore } from "pinia";
import axiosApiInstance from "../api";
import axios from "axios";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getDatabase, ref as firebaseRef, set } from "firebase/database";
import firebase from "firebase/compat/app";
import { useToast } from "primevue/usetoast";
import router from "../router/router";

const apiKey = import.meta.env.VITE_API_KEY_FIREBASE;

export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref({
    token: "",
    email: "",
    userId: "",
    refreshToken: "",
  });
  const error = ref("");
  const loader = ref(false);
  const auth = getAuth();
  const toast = useToast();

  const provider = ref();

  const Authentication = async (email, password, type) => {
    error.value = "";
    loader.value = true;
    try {
      var response;
      // провайдер
      provider.value = "password";
      localStorage.setItem("provider", JSON.stringify(provider.value));

      if (type === "signup") {
        response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        ).then(() => {
          const user = firebase.auth().currentUser;
          var actionCodeSettings = {
            url: "https://localhost:443/register/cars/?email=" + user.email,
            handleCodeInApp: true,
          };
          user
            .sendEmailVerification(actionCodeSettings)
            .then(function () {
              toast.add({
                severity: "success",
                summary: "Успех!",
                detail: "На вашу почту отправлено письмо",
                life: 3000,
              });

              // запись и получение роли пользователя
              writeUserData(user.uid, "USER");
            })
            .catch(function (error) {
              toast.add({
                severity: "error",
                summary: "Ошибка!",
                detail: error,
                life: 3000,
              });
            });
        });
      }
      if (type === "signin") {
        response = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          error.value =
            "Адрес электронной почты уже используется другой учетной записью";
          break;
        case "auth/operation-not-allowed":
          error.value = "вход с паролем для этого проекта отключен";
          break;
        case "auth/too-many-requests":
          error.value =
            "Мы заблокировали все запросы с этого устройства из-за необычной активности. Попробуйте позже.";
          break;
        case "auth/invalid-credential":
          error.value = "Неверный логин или пароль";
          break;
        case "auth/user-disabled":
          error.value =
            "Учетная запись пользователя отключена администратором.";
          break;
        case "auth/invalid-email":
          error.value = "Неверный email";
          break;
        case "auth/wrong-password":
          error.value = "Отсутствует пароль";
          break;
        default:
          error.value = "Error";
      }
      throw error.value;
    } finally {
      loader.value = false;
    }
  };

  const writeUserData = async (userId, role) => {
    const db = getDatabase();
    await set(firebaseRef(db, "users/" + userId), {
      id: userId,
      role: role,
    });
  };

  const resetPassword = async (email) => {
    var actionCodeSettings = {
      url: "https://localhost:443/register/signin",
      handleCodeInApp: false,
    };
    await firebase
      .auth()
      .sendPasswordResetEmail(email, actionCodeSettings)
      .then(() => {})
      .catch((error) => {
        console.log(error.code);
        throw error.code;
      });
  };

  const updatePassword = async (oobCode, newPassword) => {
    await firebase
      .auth()
      .confirmPasswordReset(oobCode, newPassword)
      .then(() => {})
      .catch((error) => {
        console.log(error.code);
        throw error.code;
      });
  };

  const logout = () => {
    userInfo.value = {
      token: "",
      refreshToken: "",
    };
  };

  return {
    Authentication,
    userInfo,
    error,
    loader,
    logout,
    writeUserData,
    provider,
    resetPassword,
    updatePassword,
  };
});
