import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from "@/router/router.js";
import directives from "@/directives";
import {autoAnimatePlugin} from "@formkit/auto-animate/vue";
import components from "@/components/UI";
import PrimeVue from 'primevue/config';
import { initializeApp } from "firebase/app";
import 'primevue/resources/themes/aura-light-green/theme.css'
import './index.scss';

const firebaseConfig = {
  apiKey: "AIzaSyBay_mVgvLAjanNbJjkiP-jXG9WHIvtkkQ",
  authDomain: "jwt-firebase-vue3-e771d.firebaseapp.com",
  projectId: "jwt-firebase-vue3-e771d",
  storageBucket: "jwt-firebase-vue3-e771d.appspot.com",
  messagingSenderId: "814423927236",
  appId: "1:814423927236:web:f582985e524897f3b0dc91"
};

initializeApp(firebaseConfig)

const app = createApp(App);
const pinia = createPinia();

components.forEach((component) => {
  app.component(component.name, component);
});

directives.forEach((directive) => {
  app.directive(directive.name, directive);
});

app
  .use(autoAnimatePlugin)
  .use(pinia)
  .use(router)
  .use(PrimeVue, { unstyled: true })
  .mount('#app')

