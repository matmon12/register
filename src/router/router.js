import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import SignUp from "@/pages/SignUp.vue";
import SignIn from "@/pages/SignIn.vue";
import Cars from "@/pages/Cars.vue";
import User from "@/pages/User.vue";
import OTPVerifier from "@/pages/OTPVerifier.vue";
import Dashboard from "@/pages/Dashboard.vue";
import NewPassword from "@/pages/NewPassword.vue";
import { useAuthStore } from "@/stores/auth";
import { useAuthGoogleStore } from "@/stores/authGoogle";
import { useAuthPhoneStore } from "@/stores/authPhone";
import { ability } from "@/services/ability";

const routes = [
  {
    path: "/register/",
    name: "Home",
    component: Home,
    // meta: { action: "visit", resource: "Home" },
  },
  {
    path: "/register/signup",
    name: "SignUp",
    component: SignUp,
    meta: { auth: false },
  },
  {
    path: "/register/signin",
    name: "SignIn",
    component: SignIn,
    meta: { auth: false },
  },
  {
    path: "/register/cars",
    name: "Cars",
    component: Cars,
  },
  {
    path: "/register/user",
    name: "User",
    component: User,
    meta: { auth: true }
  },
  {
    path: "/register/verifier",
    name: "OTPVerifier",
    component: OTPVerifier,
  },
  {
    path: "/register/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { auth: true, action: "visit", resource: "Dashboard" },
  },
  {
    path: '/register/update_password',
    name: "NewPassword",
    component: NewPassword,
    meta: { auth: false }
  }
];

const router = createRouter({
  mode: history,
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const authGoogleStore = useAuthGoogleStore();
  const authPhone = useAuthPhoneStore();

  const canNavigate = to.matched.some((route) => {
    if (route.meta.action) {
      return ability.can(route.meta.action, route.meta.resource);
    } else {
      return true;
    }
  });

  if (
    to.meta.auth &&
    !authStore.userInfo.token &&
    !authGoogleStore.userInfo.token &&
    !authPhone.userTokens.token
  ) {
    next("/register/signin");
  } else if (
    to.meta.auth === false &&
    (authStore.userInfo.token ||
      authGoogleStore.userInfo.token ||
      authPhone.userTokens.token)
  ) {
    next("/register/cars");
  } else if (!canNavigate) {
    next("/register/");
  } else {
    next();
  }
});

export default router;
