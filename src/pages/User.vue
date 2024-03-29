<template>
  <Card class="user">
    <template #title> Профиль </template>
    <template #content>
      <div class="user-skeleton" v-if="loading">
        <Skeleton shape="circle" size="12rem" class="user-skeleton-item"></Skeleton>
        <Skeleton width="15rem" height="1.5rem" class="user-skeleton-item"></Skeleton>
        <Skeleton width="20rem" height="1.5rem" class="user-skeleton-item"></Skeleton>
      </div>
      <div class="user-box" v-else>
        <div class="user-avatar">
          <img
            v-if="photo"
            class="user-avatar-img"
            :src="photo"
            alt="avatar"
          />
          <i-mdi:person-circle v-else/>
        </div>
        <p class="user-name">
          {{ fullName }}
        </p>
        <p class="user-email">
          {{ email ? email : education }}
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useAuthGoogleStore } from "@/stores/authGoogle";
import { useAuthVKStore } from "@/stores/authVK";
import { onMounted } from "vue";
import { ref } from "vue";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";

const authGoogleStore = useAuthGoogleStore();
const authVKStore = useAuthVKStore();

const photo = ref("");
const fullName = ref("");
const email = ref("");
const education = ref("");
const loading = ref(false);

onMounted(() => {
  if (authVKStore.accessToken) {
    fetchUserVK(authVKStore.accessToken);
  }
  fetchUserGoogle();
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

const fetchUserVK = (accessToken) => {
  loading.value = true;
  doCORSRequest(
    {
      url: `https://api.vk.com/method/users.get?user_id=459602091&v=5.131&access_token=${accessToken}&fields=photo_400_orig, education`,
    },
    function printResult(result) {
      const parseUser = JSON.parse(result).response[0];

      photo.value = parseUser.photo_400_orig;
      fullName.value = `${parseUser.first_name}  ${parseUser.last_name}`;
      education.value = parseUser.university_name;

      loading.value = false;
    }
  );
};

const fetchUserGoogle = () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.providerData[0].providerId === "google.com") {
        photo.value = user.providerData[0].photoURL;
        fullName.value = user.providerData[0].displayName;
        email.value = user.providerData[0].email;
      }
      if (user.providerData[0].providerId === 'password') {
        fullName.value = 'Неизвстно';
        email.value = user.providerData[0].email;
      }
      if (user.providerData[0].providerId === 'phone') {
        fullName.value = 'Неизвстно';
        email.value = user.providerData[0].phoneNumber;
      }
    } else {
      console.log("none");
    }
  });
};
</script>

<style lang="scss" scoped>
.user {
  width: 100%;
  background-color: var(--color-main);
  color: var(--color-white);
  &-box {
    margin: 0 auto;
    text-align: center;
  }
}
.user-avatar {
  max-width: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
}
.user-avatar-img {
  object-fit: cover;
}
.user-name {
  margin-top: 20px;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}
.user-email {
}

.user-skeleton {
  display: flex;
  gap: 15px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
