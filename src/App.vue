<template>
  <main>
    <div class="container">
      <div class="tabs">
        <div class="tab" :class="{ 'tab--active': $route.path === '/register/' }">
          <router-link to="/register/">
            <div class="tab__box">
              <span class="tab-icon"><i-ant-design-home-outlined /></span>
              <span class="tab-text">Home</span>
            </div>
          </router-link>
        </div>
        <div
          class="tab"
          :class="{ 'tab--active': $route.path === '/register/signin' }"
          v-if="!token && !tokenGoogle && !tokenPhone"
        >
          <router-link to="/register/signin">
            <div class="tab__box">
              <span class="tab-icon"><i-uil-signin /></span>
              <span class="tab-text">SignIn</span>
            </div>
          </router-link>
        </div>
        <div class="tab" :class="{ 'tab--active': $route.path === '/register/cars' }">
          <router-link to="/register/cars">
            <div class="tab__box">
              <span class="tab-icon"><i-mdi-car /></span>
              <span class="tab-text">Cars</span>
            </div>
          </router-link>
        </div>
        <div
          class="tab"
          :class="{ 'tab--active': $route.path === '/register/user' }"
          v-if="token || tokenGoogle || tokenPhone"
        >
          <router-link to="/register/user">
            <div class="tab__box">
              <span class="tab-icon"><i-iconamoon:profile-circle-fill /></span>
              <span class="tab-text">Профиль</span>
            </div>
          </router-link>
        </div>
        <div
          class="tab"
          :class="{ 'tab--active': $route.path === '/register/dashboard' }"
          v-if="(token || tokenGoogle || tokenPhone) && can('visit', 'Dashboard')"
        >
          <router-link to="/register/dashboard">
            <div class="tab__box">
              <span class="tab-icon"><i-eos-icons:admin-outlined /></span>
              <span class="tab-text">Админ</span>
            </div>
          </router-link>
        </div>
        <div
          class="tab"
          :class="{ 'tab--active': $route.path === '/register/logout' }"
          v-if="token || tokenGoogle || tokenPhone"
          @click.prevent="logout"
        >
          <div class="tab__box">
            <span class="tab-icon"><i-material-symbols-logout /></span>
            <span class="tab-text">Logout</span>
          </div>
        </div>
      </div>
      <router-view></router-view>

      <div id="recaptcha-container"></div>
      <Toast />
    </div>

    <div class="theme-switch-wrapper">
      <Switch @toggle-switch="(value) => {changeTheme(value)}"/>
    </div>
    <div class="loader-wrapper" v-if="loaderLogout">
      <Loader />
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useAuthGoogleStore } from "@/stores/authGoogle";
import { useAuthVKStore } from "@/stores/authVK";
import { useAuthPhoneStore } from "@/stores/authPhone";
import { useRolesStore } from "@/stores/roles";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import router from "./router/router";
import {
  signOut,
  getAuth,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { getDatabase, ref as firebaseRef, get, child } from "firebase/database";
import { useAbility } from "@casl/vue";
import { defineAbilityFor } from "@/services/ability";
import { useThemeStore } from "@/stores/theme.js";

const loaderLogout = ref(false);
const auth = getAuth();
const toast = useToast();
const authStore = useAuthStore();
const authGoogleStore = useAuthGoogleStore();
const authVK = useAuthVKStore();
const authPhone = useAuthPhoneStore();
const roleStore = useRolesStore();
const themeStore = useThemeStore();
const token = computed(() => authStore.userInfo.token);
const tokenGoogle = computed(() => authGoogleStore.userInfo.token);
const tokenPhone = computed(() => authPhone.userTokens.token);
const ability = useAbility();
const checked = ref(true);

const logout = () => {
  loaderLogout.value = true;
  signOut(auth)
    .then(() => {
      if (authStore.userInfo.token) {
        authStore.logout();
        localStorage.removeItem("userTokens");
      }
      if (authGoogleStore.userInfo.token) {
        authGoogleStore.logout();
        localStorage.removeItem("userWithGoogle");
      }
      if (authVK.accessToken) {
        authVK.logout();
        localStorage.removeItem("userVK");
      }
      if (authPhone.userTokens.token) {
        authPhone.logout();
        localStorage.removeItem("phoneTokens");
        localStorage.removeItem("authPhone");
        localStorage.removeItem("phone");
        localStorage.removeItem("time");
      }
      router.push("/register/signin");

      // role
      roleStore.role = "GUEST";
      localStorage.removeItem("role");
      defineRole();

      // провайдер
      authStore.provider = "";
      localStorage.removeItem("provider");

      toast.add({
        severity: "secondary",
        summary: "Выход",
        detail: "Вы вышли из системы",
        life: 3000,
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loaderLogout.value = false;
    });
};

const checkUser = () => {
  const tokens = JSON.parse(localStorage.getItem("userTokens"));
  const userWithGoogle = JSON.parse(localStorage.getItem("userWithGoogle"));
  const tokenVK = JSON.parse(localStorage.getItem("userVK"));
  const userWithPhone = JSON.parse(localStorage.getItem("phoneTokens"));
  const provider = JSON.parse(localStorage.getItem("provider"));
  if (tokens) {
    authStore.userInfo.token = tokens.token;
    authStore.userInfo.refreshToken = tokens.refreshToken;
  }
  if (userWithGoogle) {
    authGoogleStore.userInfo.token = userWithGoogle.token;
    authGoogleStore.userInfo.refreshToken = userWithGoogle.refreshToken;
  }
  if (tokenVK) {
    authVK.accessToken = tokenVK.token;
  }
  if (userWithPhone) {
    authPhone.userTokens.token = userWithPhone.token;
    authPhone.userTokens.refreshToken = userWithPhone.refreshToken;
  }
  if (provider) {
    authStore.provider = provider;
  }
};
checkUser();

const themeSistem = () => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add('dark');
  } else {
    themeStore.setTheme();
  }
};

const changeTheme = (value) => {
  value ? document.body.classList.add('dark') : document.body.classList.remove('dark');
}

onMounted(() => {
  const auth = getAuth();
  // получение роли из localStorage
  const localRole = JSON.parse(localStorage.getItem("role"));
  if (localRole) {
    roleStore.role = localRole;
  }
  defineRole();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (
        user.emailVerified &&
        !authStore.userInfo.token &&
        authStore.provider === "password"
      ) {
        authStore.userInfo = {
          token: user.accessToken,
          refreshToken: user.refreshToken,
        };

        localStorage.setItem(
          "userTokens",
          JSON.stringify({
            token: authStore.userInfo.token,
            refreshToken: authStore.userInfo.refreshToken,
          })
        );

        router.push("/register/cars");

        toast.add({
          severity: "success",
          summary: "Успех!",
          detail: "Выполнен вход",
          life: 3000,
        });
      }
      const dbRef = firebaseRef(getDatabase());
      get(child(dbRef, `users/${user.uid}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            // role
            roleStore.role = snapshot.val().role;
            if (localRole !== roleStore.role) {
              localStorage.setItem("role", JSON.stringify(roleStore.role));
              defineRole();
            }
          } else {
            console.log("No data");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("non");
    }
  });

  themeSistem();
});

const defineRole = () => {
  ability.update(defineAbilityFor(roleStore.role));
};

// roles
const { can } = useAbility();
</script>

<style scoped lang="scss">
.tabs {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 25px;
}
.tab {
  cursor: pointer;
  color: var(--color-white);
  a {
    color: var(--color-white);
  }
  &__box {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  &--active {
    a {
      color: #079c70;
    }
  }
}
.tab-icon {
  width: 25px;
  height: 25px;
}
.tab-text {
  font-size: 20px;
  font-weight: 500;
}
.loader-wrapper {
  position: fixed;
  inset: 0;
  background-color: #ffffffb7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-switch-wrapper {
  position: absolute;
  top: 20px;
  right: 40px;
}
</style>
