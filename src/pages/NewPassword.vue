<template>
  <div class="update-password-wrapper">
    <Card class="update-password">
      <template #title>
        <span class="update-password-title">Сменить пароль</span>
      </template>
      <template #content>
        <div class="update-password-inputgroup">
          <label for="update-password-1" class="update-password-label"
            >Новый пароль</label
          >
          <Password
            class="update-password-input"
            id="update-password-1"
            placeholder="Ввод"
            :feedback="false"
            toggleMask
            v-model="password"
            :class="{ 'p-invalid': errors.password }"
          />
          <transition name="fade">
            <small class="error" v-if="errors.password">
              {{ errors.password }}
            </small>
          </transition>
        </div>
        <div class="update-password-inputgroup">
          <label for="update-password-2" class="update-password-label"
            >Новый пароль (еще раз)</label
          >
          <Password
            class="update-password-input"
            id="update-password-2"
            placeholder="Ввод"
            :feedback="false"
            toggleMask
            v-model="passwordConfirm"
            :class="{ 'p-invalid': errors.confirmPassword }"
          />
          <transition name="fade">
            <small class="error" v-if="errors.confirmPassword">
              {{ errors.confirmPassword }}
            </small>
          </transition>
        </div>

        <Button class="update-password-btn" @click="changePassword" :disabled="loaderUpdate"
          >
          <i-svg-spinners:180-ring class="update-password-btn-icon" v-if="loaderUpdate" />
          <span>Сменить пароль</span></Button
        >
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useForm } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";

const rulesStore = useRulesStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const errorUpdate = ref();
const loaderUpdate = ref(false);

const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: rulesStore.schemaUpdatePassword,
});

const [password] = defineField("password");
const [passwordConfirm] = defineField("confirmPassword");

const changePassword = handleSubmit((values) => {
  loaderUpdate.value = true;
  authStore
    .updatePassword(route.query.oobCode, password.value)
    .then(() => {
      password.value = "";
      passwordConfirm.value = "";

      router.push("/register/signin");

      toast.add({
        severity: "success",
        summary: "Успех!",
        detail: "Пароль обновлен",
        life: 3000,
      });
    })
    .catch((error) => {
      switch (error) {
        case "auth/expired-action-code":
          errorUpdate.value = "Cрок действия кода сброса пароля истек";
          break;
        case "auth/invalid-action-code":
          errorUpdate.value = "Код сброса пароля недействителен";
          break;
        case "auth/user-not-found":
          errorUpdate.value = "Пользователен не найден";
          break;
        case "auth/weak-password":
          errorUpdate.value = "Новый пароль недостаточно надежный";
          break;
      }
      toast.add({
        severity: "error",
        summary: "Ошибка!",
        detail: errorUpdate.value,
        life: 3000,
      });
    })
    .finally(() => {
      loaderUpdate.value = false;
    });
});
</script>

<style lang="scss" scoped>
.update-password-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: auto;
}
.update-password {
  width: 400px;
  background-color: var(--color-main);
  color: var(--color-white);
  z-index: 0;
}
.update-password-title {
  font-size: 25px;
}
.update-password-inputgroup {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 20px;
  position: relative;
  .error {
    font-weight: 400;
    font-size: 12px;
  }
}
.update-password-label {
  font-size: 14px;
  color: #bebebe;
}
.update-password-btn {
  margin-top: 20px;
  margin-left: auto;
  display: flex;
  &-icon{
    height: 20px;
    width: 20px;
    margin-right: 10px;
  }
}
</style>
<style lang="scss">
.update-password-input {
  .p-inputtext {
    border-radius: 6px;
    width: 100%;
    &::placeholder {
      font-weight: 400;
      text-align: left;
    }
  }
}
</style>
