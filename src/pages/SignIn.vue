<template>
  <div class="signup">
    <h1 class="signup-title">Sign In</h1>
    <p class="signup-info" v-if="visibleInfoReset">
      На указанный email отправлено письмо с инструкциями по сбросу пароля. Если вы не
      получили его в течение нескольких минут, проверьте папку спам. Если письма нет,
      напишите нам: help@stepik.org
    </p>
    <form class="signup-form">
      <Message severity="warn" v-if="authStore.error || authGoogleStore.error"
        >{{ authStore.error }}{{ authGoogleStore.error }}</Message
      >
      <InputGroup class="signup-input-box">
        <InputGroupAddon>
          <i-gravity-ui-person />
        </InputGroupAddon>
        <InputText
          class="signup-input"
          placeholder="Your Email"
          v-model="email"
          aria-describedby="email-help"
          :class="{ 'p-invalid': errors.email }"
        />
        <transition name="fade">
          <small class="error" v-if="errors.email">
            {{ errors.email }}
          </small>
        </transition>
      </InputGroup>
      <InputGroup class="signup-input-box">
        <InputGroupAddon>
          <i-ph-at-bold />
        </InputGroupAddon>
        <Password
          class="signup-input"
          v-model="password"
          placeholder="Your Password"
          :feedback="false"
          toggleMask
          aria-describedby="password-help"
          :class="{ 'p-invalid': errors.password }"
        />
        <transition name="fade">
          <small class="error" v-if="errors.password">
            {{ errors.password }}
          </small>
        </transition>
      </InputGroup>
      <Loader v-if="authStore.loader || authGoogleStore.loader" />
      <div v-else class="signup__box">
        <Button label="Signin" class="signup-btn" @click="onSubmit" />
        <div class="signup__signin">
          <p class="signup__text">Are you not registered yet?</p>
          <router-link to="/register/signup">
            <Button label="Sign up" link />
          </router-link>
          <Button class="signup-reset" link @click="visibleModal = true"
            >Reset password</Button
          >
        </div>
        <div class="signup__other">
          <p class="signup__other-text">Войдите используя</p>
          <div class="signup__list">
            <AuthGoogle />
            <AuthVK />
            <AuthPhone />
          </div>
        </div>
      </div>
    </form>
  </div>

  <Dialog
    v-model:visible="visibleModal"
    modal
    :pt="{
      root: 'border-none',
      mask: {
        style:
          'backdrop-filter: blur(5px); background-color: rgba(0, 0, 0, 0.7) !important',
      },
    }"
  >
    <template #container="{ closeCallback }">
      <div class="modal-reset" v-on-click-outside="closeCallback">
        <div class="modal-reset-head">
          <h1 class="modal-reset-title">Забыли свой пароль?</h1>
          <button class="modal-reset-close" @click="closeCallback">
            <i-ion:close />
          </button>
        </div>

        <p class="modal-reset-text">
          Введите свой e-mail адрес, и мы отправим вам письмо со ссылкой для сброса
          пароля.
        </p>

        <div class="modal-reset-input__wrapper">
          <InputText
            class="modal-reset-input"
            placeholder="Введите email"
            v-model="modalEmail"
            :class="{ 'p-invalid': errorsReset.email }"
          />
          <transition name="fade">
            <small class="error" v-if="errorsReset.email">
              {{ errorsReset.email }}
            </small>
          </transition>
        </div>

        <div class="modal-reset-btns">
          <Button
            class="modal-reset-btn"
            type="button"
            severity="secondary"
            @click="closeCallback"
            >Отмена</Button
          >
          <Button class="modal-reset-btn" @click.prevent="resetPassword" :disabled="loaderReset">
            <i-svg-spinners:180-ring class="modal-reset-btn-icon" v-if="loaderReset" />
            <span>Сбросить пароль</span>
          </Button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useAuthGoogleStore } from "@/stores/authGoogle";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import { useToast } from "primevue/usetoast";
import { useAbility } from "@casl/vue";
import { getAuth } from "firebase/auth";
import { vOnClickOutside } from "@vueuse/components";

const { can } = useAbility();

const router = useRouter();
const authStore = useAuthStore();
const authGoogleStore = useAuthGoogleStore();
const rulesStore = useRulesStore();
const toast = useToast();
const visibleModal = ref(false);
const visibleInfoReset = ref(false);
const errorReset = ref("");
const loaderReset = ref(false);

const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: rulesStore.schemaSignin,
});

const {
  defineField: defineFieldReset,
  handleSubmit: handleSubmitReset,
  resetForm: resetFormReset,
  errors: errorsReset,
} = useForm({
  validationSchema: rulesStore.schemaEmail,
});

const [email] = defineField("email");
const [password] = defineField("password");
const [modalEmail] = defineFieldReset("email");

const onSubmit = handleSubmit((values) => {
  signin();
});

const resetPassword = handleSubmitReset((values) => {
  loaderReset.value = true;
  authStore
    .resetPassword(modalEmail.value)
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Успех!",
        detail: "Письмо для сброса отправлено вам на почту",
        life: 3000,
      });

      visibleModal.value = false;
      visibleInfoReset.value = true;

      modalEmail.value = "";
    })
    .catch((err) => {
      switch (err) {
        case "auth/network-request-failed":
          errorReset.value = "Неудачный сетевой запрос";
          break;
        case "auth/invalid-email":
          errorReset.value = "адрес электронной почты недействителен";
          break;
        case "auth/user-not-found":
          errorReset.value = "Пользователь с такой почтой не найден";
          break;
        default:
          errorReset.value = "Ошибка";
          break;
      }
      toast.add({
        severity: "error",
        summary: "Ошибка!",
        detail: errorReset.value,
        life: 3000,
      });
    })
    .finally(() => {
      loaderReset.value = false;
    });
});

const signin = async () => {
  try {
    await authStore.Authentication(email.value, password.value, "signin");
    const auth = getAuth();
    if (!auth.currentUser.emailVerified) {
      toast.add({
        severity: "error",
        summary: "Ошибка!",
        detail: "Необходимо подтвердить email",
        life: 3000,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  authStore.error = "";
  authGoogleStore.error = "";
});
</script>

<style lang="scss" scoped>
.signup {
  padding-top: 50px;
  color: var(--color-white);

  &-info {
    color: #a3a3a3;
    font-weight: 400;
    font-size: 12px;
    max-width: 90%;
    margin-bottom: 10px;
  }

  &__signin {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  &__text {
    font-weight: 600;
  }
  &__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &-reset {
    margin-left: auto;
    font-weight: 500;
    text-decoration: underline;
  }
}
.signup__other {
  margin-top: 20px;
  &-text {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
  }
  &-btn {
    background-color: #fff;
    color: #000;
    border: 2px solid #9ab2ff;
    &:hover {
      background-color: #9ab2ff;
    }
  }
  &-btn-text {
    margin-left: 7px;
    font-weight: 500;
  }
}
.signup-title {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 10px;
}
.signup-form {
}
.signup-input-box {
  margin-bottom: 20px;
  position: relative;
}

.signup-btn {
  width: 100%;
  margin-bottom: 10px;
}

.modal-reset {
  max-width: 400px;
  padding: 20px;
  background-color: var(--color-main);
  border-radius: 12px;
  color: var(--color-white);
  z-index: 0;
}
.modal-reset-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.modal-reset-title {
  font-size: 20px;
  font-weight: 600;
}
.modal-reset-input {
  width: 100%;
  border-radius: 6px;
  &::placeholder {
    font-weight: 400;
    text-align: left;
  }
  &__wrapper {
    position: relative;
    .error {
      left: 0;
      font-weight: 400;
    }
  }
}
.modal-reset-close {
  color: #7c7c7c;
}
.modal-reset-text {
  font-size: 12px;
  color: #7c7c7c;
  text-align: center;
  // max-width: 70%;
  margin: 0 auto 10px;
}
.modal-reset-btns {
  margin-top: 30px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.modal-reset-btn {
  font-size: 13px;
  font-weight: 500;
  &-icon{
    height: 20px;
    width: 20px;
    margin-right: 10px;
  }
}
</style>
<style>
.p-button.p-button-link .p-button-label {
  text-decoration: underline;
}
.p-inputgroup-addon {
  background: #e7e7e7;
  color: #64748b;
}
.p-inputtext {
  border-radius: 0 6px 6px 0;
  background-color: var(--color-main);
  color: var(--color-white);
}
.p-inputtext.p-invalid:focus {
  outline: #f87171;
}
.p-password.p-invalid.p-component > .p-inputtext:focus {
  outline: #f87171;
}
</style>
