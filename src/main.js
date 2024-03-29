import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "@/router/router.js";
import directives from "@/directives";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import "./api.js";
import { VueQueryPlugin } from "vue-query";
import { auth } from "@/firebase.config";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
import "./index.scss";
import "primevue/resources/themes/aura-light-green/theme.css";
import { abilitiesPlugin } from "@casl/vue";
import { ability } from "@/services/ability.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale,
  BarElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale,
  BarElement
);


const app = createApp(App);
const pinia = createPinia();


directives.forEach((directive) => {
  app.directive(directive.name, directive);
});


app
  .use(autoAnimatePlugin)
  .use(pinia)
  .use(router)
  .use(PrimeVue)
  .use(ToastService)
  .use(VueQueryPlugin)
  .use(VueTelInput)
  .use(abilitiesPlugin, ability, {
    useGlobalProperties: true,
  })
  .mount("#app");
