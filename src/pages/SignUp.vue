<template>
  <div class="signup">
    <h1 class="signup-title">Sign Up</h1>
    <form class="signup-form">
      <Message severity="warn" v-if="authStore.error">{{ authStore.error }}</Message>
      <InputGroup class="signup-input">
        <InputGroupAddon>
          <i-ph-at-bold />
        </InputGroupAddon>
        <InputText
          placeholder="Your Email"
          v-model="email"
          aria-describedby="email-help"
          :class="{ 'p-invalid': errors.mail }"
        />
        <transition name="fade">
          <small class="error" v-if="errors.email">
            {{ errors.email }}
          </small>
        </transition>
      </InputGroup>
      <InputGroup class="signup-input">
        <InputGroupAddon>
          <i-mdi-password />
        </InputGroupAddon>
        <Password
          v-model="password"
          placeholder="Your Password"
          toggleMask
          :feedback="false"
          aria-describedby="password-help"
          :class="{ 'p-invalid': errors.password }"
        />
        <transition name="fade">
          <small class="error" v-if="errors.password">
            {{ errors.password }}
          </small>
        </transition>
      </InputGroup>
      <InputGroup class="signup-input">
        <InputGroupAddon>
          <i-mdi-password-outline />
        </InputGroupAddon>
        <Password
          v-model="confirm"
          placeholder="Confirm password"
          toggleMask
          :feedback="false"
          aria-describedby="password-help"
          :class="{ 'p-invalid': errors.confirmPassword }"
        />
        <transition name="fade">
          <small class="error" v-if="errors.confirmPassword">
            {{ errors.confirmPassword }}
          </small>
        </transition>
      </InputGroup>
      <Loader v-if="authStore.loader" />
      <div v-else class="signup__box">
        <Button label="Signup" class="signup-btn" @click="onSubmit" />
        <div class="signup__signin">
          <p class="signup__text">Are you already registered?</p>
          <router-link to="/register/signin">
            <Button label="Sign in" link />
          </router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const authStore = useAuthStore();
const rulesStore = useRulesStore();
const toast = useToast();

// validation
const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: rulesStore.schemaSignup,
});

const [email] = defineField("email");
const [password] = defineField("password");
const [confirm] = defineField("confirmPassword");

const onSubmit = handleSubmit((values) => {
  signup();
});

const signup = async () => {
  try {
    await authStore.Authentication(email.value, password.value, "signup");
    resetForm();
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  authStore.error = "";
  
});
</script>

<style lang="scss" scoped>
.signup {
  padding-top: 50px;
  &__signin {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  &__text {
    font-weight: 600;
  }
}
.signup-title {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 10px;
}
.signup-form {
}
.signup-input {
  margin-bottom: 20px;
  position: relative;
}
.signup-btn {
  width: 100%;
  margin-bottom: 10px;
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
</style>
