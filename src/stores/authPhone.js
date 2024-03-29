import { ref } from "vue";
import { defineStore } from "pinia";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { getDatabase, ref as firebaseRef, set } from "firebase/database";
import firebase from "firebase/compat/app";
import { auth } from "@/firebase.config";
import { useRouter } from "vue-router";
import axiosApiInstance from "../api";
import { useAuthStore } from "./auth";

export const useAuthPhoneStore = defineStore("authPhone", () => {
  const router = useRouter();
  var confirmationResult = ref();
  var recaptchaVerifier = ref();
  const modalVisible = ref(false);
  const tel = ref();
  const loadingNumber = ref(false);
  const loadingOTP = ref(false);
  const authStore = useAuthStore();

  const userTokens = ref({
    token: "",
    refreshToken: "",
  });

  const sendCode = async (phoneNumber) => {
    if (!recaptchaVerifier.value) {
      recaptchaVerifier.value = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
    try {
      loadingNumber.value = true;
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.value
      );
      confirmationResult.value = result;
      localStorage.setItem(
        "authPhone",
        JSON.stringify({
          confirmationResult: confirmationResult.value,
        })
      );
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      loadingNumber.value = false;
    }
  };

  const onOTPVerify = async (otp) => {
    loadingOTP.value = true;
    const { confirmationResult } = JSON.parse(
      localStorage.getItem("authPhone")
    );
    var credential = PhoneAuthProvider.credential(
      confirmationResult.verificationId,
      otp
    );

    // провайдер
    authStore.provider = 'phone';
    localStorage.setItem("provider", JSON.stringify(authStore.provider));

    await firebase
      .auth()
      .signInWithCredential(credential)
      .then((response) => {
        userTokens.value = {
          token: response.user.multiFactor.user.accessToken,
          refreshToken: response.user.refreshToken,
        };
        localStorage.setItem(
          "phoneTokens",
          JSON.stringify({
            token: userTokens.value.token,
            refreshToken: userTokens.value.refreshToken,
          })
        );

        if (response.additionalUserInfo.isNewUser) {
          writeUserData(response.user.uid, "USER");
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      })
      .finally(() => {
        loadingOTP.value = false;
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
    userTokens.value = {
      token: "",
      refreshToken: "",
    };
  };

  return {
    onOTPVerify,
    modalVisible,
    tel,
    sendCode,
    loadingNumber,
    loadingOTP,
    logout,
    userTokens,
  };
});
