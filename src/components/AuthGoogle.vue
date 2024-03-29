<template>
  <Button label="Google" @click="signupGoogle" class="signup__other-btn">
    <i-flat-color-icons-google class="signup__other-btn-google"/>
    <span class="signup__other-btn-text">Google</span>
  </Button>
</template>

<script setup>
import { useAuthGoogleStore } from "@/stores/authGoogle";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const authGoogleStore = useAuthGoogleStore();
const router = useRouter();
const toast = useToast();

const signupGoogle = async () => {
  try {
    await authGoogleStore.signupWithGoogle();
    router.push("/register/cars");

    toast.add({
      severity: "success",
      summary: "Успех!",
      detail: "Выполнен вход",
      life: 3000,
    });
  } catch (err) {
    console.log(err);
  }
};
</script>

<style lang="scss" scoped>
.signup__other {
  &-btn {
    background-color: #fff;
    color: #000;
    border: 2px solid #9ab2ff;
    display: flex;
    justify-content: center;
    height: 44px;
    transition: all 0.1s ease-out;
    &:active{
      transform: scale(0.97);
    }
    &:hover {
      background-color: #9ab2ff;
    }
    &-google{
      height: 20px;
      width: min-content;
    }
  }
  &-btn-text {
    margin-left: 7px;
    font-weight: 500;
  }
}
</style>
