<template>
  <button
    id="VKIDSDKAuthButton"
    class="VkIdWebSdk__button VkIdWebSdk__button_reset"
    @click.prevent="authVKStore.signupVK"
  >
    <div class="VkIdWebSdk__button_container">
      <div class="VkIdWebSdk__button_icon">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.54648 4.54648C3 6.09295 3 8.58197 3 13.56V14.44C3 19.418 3 21.907 4.54648 23.4535C6.09295 25 8.58197 25 13.56 25H14.44C19.418 25 21.907 25 23.4535 23.4535C25 21.907 25
           19.418 25 14.44V13.56C25 8.58197 25 6.09295 23.4535 4.54648C21.907 3 19.418 3 14.44 3H13.56C8.58197 3 6.09295 3 4.54648 4.54648ZM6.79999 10.15C6.91798 15.8728 9.92951 19.31 14.8932 19.31H15.1812V16.05C16.989 16.2332 18.3371 
           17.5682 18.8875 19.31H21.4939C20.7869 16.7044 18.9535 15.2604 17.8141 14.71C18.9526 14.0293 20.5641 12.3893 20.9436 10.15H18.5722C18.0747 11.971 16.5945 13.6233 15.1803 13.78V10.15H12.7711V16.5C11.305 16.1337 9.39237 14.3538 9.314 10.15H6.79999Z"
            fill="white"
          />
        </svg>
      </div>
      <div class="VkIdWebSdk__button_text">Войти через VK ID</div>
    </div>
  </button>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useAuthVKStore } from "@/stores/authVK";
import axios from "axios";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const authVKStore = useAuthVKStore();
const toast = useToast();

onMounted(() => {
  if (route.query.payload) {
    getAccessToken();
  }
});

var cors_api_url = "https://cors-anywhere.herokuapp.com/";
function doCORSRequest(options, printResult) {
  var x = new XMLHttpRequest();
  x.open("GET", cors_api_url + options.url);
  x.onload = x.onerror = function () {
    printResult(x.responseText || "");
  };
  if (/^POST/i.test("GET")) {
    x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }
  x.send(options.data);
}

// Bind event
const getAccessToken = () => {
  const query = route.query.payload;
  const parse = JSON.parse(query);
  const request = `https://api.vk.com/method/auth.exchangeSilentAuthToken?v=5.131&token=${parse.token}&access_token=2d1956c62d1956c62d1956c6252e0edd3d22d192d1956c648f794d983e56538b166a4e9&uuid=${parse.uuid}`;
  doCORSRequest(
    {
      url: request,
    },
    function printResult(result) {
      const parseAccessToken = JSON.parse(result);
      authVKStore.accessToken = parseAccessToken.response.access_token;
      authVKStore.email = parseAccessToken.response.email;

      localStorage.setItem("userVK", JSON.stringify({token: authVKStore.accessToken}))

      // delete query параметры
      let path = route.path;
      router.replace(path);

      authWithEmailandPassword();
    }
  );
};

const authWithEmailandPassword = async () => {
  try {
    await authStore.Authentication(generateRandomEmail(), gen_password(10), "signup");
    router.push("/register/cars");

    toast.add({
      severity: "success",
      summary: "Успех!",
      detail: "Вы успешно вошли в систему",
      life: 3000,
    });
  } catch (err) {
    console.log(err);
  }
};

const gen_password = (len) => {
  var password = "";
  var symbols =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!№;%:?*()_+=";
  for (var i = 0; i < len; i++) {
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  }
  return password;
};

const generateRandomEmail = () => {
  const domains = ['gmail.com', 'mail.ru', 'yandex.ru'];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  const username = Math.random().toString(36).substring(4);

  return `${username}@${randomDomain}`;
}
</script>

<style lang="scss" scoped>
.VkIdWebSdk__button_reset {
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
}

.VkIdWebSdk__button {
  background: #0077ff;
  cursor: pointer;
  transition: all 0.1s ease-out;
}

.VkIdWebSdk__button:hover {
  opacity: 0.8;
}

.VkIdWebSdk__button:active {
  opacity: 0.7;
  transform: scale(0.97);
}

.VkIdWebSdk__button {
  border-radius: 8px;
  width: 100%;
  height: 44px;
  &_icon {
    height: 28px;
  }
}

.VkIdWebSdk__button_container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 10px;
}

.VkIdWebSdk__button_icon + .VkIdWebSdk__button_text {
  margin-left: -28px;
}

.VkIdWebSdk__button_text {
  display: flex;
  font-family: -apple-system, system-ui, "Helvetica Neue", Roboto, sans-serif;
  flex: 1;
  justify-content: center;
  color: #ffffff;
}
</style>
