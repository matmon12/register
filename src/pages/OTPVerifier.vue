<template>
  <div class="code-wrapper">
    <Card class="code">
      <template #title>
        <button class="code-back" @click="router.push('/register/signin')">
          <i-ph:arrow-left-bold />
        </button>
        <span class="code-title">Введите код</span>
      </template>
      <template #content>
        <div class="code__inner">
          <div class="code-text">
            Мы отправили код подтверждения на номер
            <span class="code-number">{{ authPhone.tel }}</span>
            <button class="code-change" @click="changeNumber">Изменить</button>
          </div>
          <div class="code-otp">
            <v-otp-input
              ref="otpInput"
              input-classes="otp-input"
              :conditionalClass="['one', 'two', 'three', 'four']"
              separator=""
              :num-inputs="6"
              v-model:value="otp"
              :should-auto-focus="true"
              :should-focus-order="true"
              :class="{ invalid: errors.otp && isSubmit }"
            />
            <transition name="fade">
              <small class="error" v-if="errors.otp && isSubmit">
                {{ errors.otp }}
              </small>
            </transition>
          </div>
          <div class="code-new">
            <p class="code-new-timer" v-if="!isFinishTimer">
              Получить новый код можно через <span>{{ minutes }}</span
              >:<span>{{ sec }}</span>
            </p>
            <button class="code-new-btn" v-else @click="getNewCode">
              Получить новый код
            </button>
          </div>
          <div class="code-checkbox" :class="{ invalid: errors.checkbox && isSubmit }">
            <Checkbox
              v-model="checkbox"
              :binary="true"
              :value="true"
              inputId="checkbox-1"
              :invalid="errors.checkbox && isSubmit ? true : false"
            />
            <label for="checkbox-1"
              >Согласен с условиями обработки персональных данных</label
            >
            <transition name="fade">
              <small class="error" v-if="errors.checkbox && isSubmit">
                {{ errors.checkbox }}
              </small>
            </transition>
          </div>
          <div class="code-checkbox">
            <Checkbox v-model="checkbox2" inputId="checkbox-2" value="agree" />
            <label for="checkbox-2"
              >Хочу получать сообщения рекламного и информационного характера</label
            >
          </div>
          <Button class="code-signup" @click="onSubmit" :disabled="authPhone.loadingOTP">
            <i-svg-spinners:180-ring class="modal-btn-icon" v-if="authPhone.loadingOTP" />
            Зарегистрироваться
          </Button>

          <button class="code-sms" @click="visibleModal = true">Не приходит СМС?</button>
        </div>
      </template>
    </Card>
  </div>
  <Dialog v-model:visible="visibleModal" modal>
    <template #container="{ closeCallback }">
      <div class="modal-sms" v-on-click-outside="closeCallback">
        <div class="modal-sms-header">
          <p class="modal-sms-title">Не приходит СМС?</p>
          <button class="modal-sms-close" @click="closeCallback"><i-ion:close /></button>
        </div>
        <p class="modal-sms-text">
          При использовании онлайн‑банкинга, оплаты в интернет‑магазинах и в иных
          ситуациях, когда необходима двухэтапная авторизация, в качестве дополнительного
          уровня защиты выступает ваш телефон. На него приходят СМС с одноразовыми
          паролями или, как их ещё называют, кодами подтверждения. Обычно эти сообщения
          появляются мгновенно, но иногда возникают ошибки. Вот наиболее распространённые
          из них.
        </p>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import VOtpInput from "vue3-otp-input";
import { useRouter } from "vue-router";
import { useAuthPhoneStore } from "@/stores/authPhone";
import { useToast } from "primevue/usetoast";
import { useForm } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import { vOnClickOutside } from "@vueuse/components";

const router = useRouter();
const authPhone = useAuthPhoneStore();
const rulesStore = useRulesStore();
const toast = useToast();

const visibleModal = ref(false);
const otpInput = ref();
const checkbox2 = ref();
const fullTime = ref(90);
const minutes = ref("0" + Math.floor(fullTime.value / 60));
const sec = ref(
  fullTime.value % 60 < 10 ? `0${fullTime.value % 60}` : fullTime.value % 60
);
const isFinishTimer = ref(false);
const error = ref();
let timer;

const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: rulesStore.schemaOTP,
});
const [otp] = defineField("otp");
const [checkbox] = defineField("checkbox");
checkbox.value = false;
const isSubmit = ref(false);

const onSubmit = () => {
  isSubmit.value = true;
  validate();
};

const validate = handleSubmit((values) => {
  authPhone
    .onOTPVerify(values.otp)
    .then(() => {
      router.push("/register/cars");
      toast.add({
        severity: "success",
        summary: "Успешно!",
        detail: "Вы успешно вошли в систему",
        life: 3000
      })
    })
    .catch((err) => {
      switch (err.code) {
        case "auth/code-expired":
          error.value = "Срок действия кода истек!";
          break;
        default:
          error.value = "Ошибка, попробуйте еще раз";
      }
      toast.add({
        severity: "error",
        summary: "Ошибка!",
        detail: error.value,
        life: 3000,
      });
    })
    .finally(() => {
      isSubmit.value = false;
      otp.value = '';
    });
});

const changeNumber = () => {
  router.push("/register/signin");
  authPhone.modalVisible = true;
};

const getNewCode = () => {
  localStorage.removeItem("time");
  clearInterval(timer);
  minutes.value = "0" + Math.floor(fullTime.value / 60);
  sec.value = fullTime.value % 60 < 10 ? `0${fullTime.value % 60}` : fullTime.value % 60;
  setTimer();

  isFinishTimer.value = false;
  authPhone
    .sendCode(authPhone.tel)
    .then(() => {
      toast.add({
        severity: "secondary",
        summary: "Успешно",
        detail: "Номер отправлен на ваш номер",
        life: 3000,
      });
    })
    .catch((error) => {
      toast.add({
        severity: "error",
        summary: "Ошибка!",
        detail: error,
        life: 3000,
      });
    });
};

onMounted(() => {
  setTimer();
  const { phoneNumber } = JSON.parse(localStorage.getItem("phone"));
  authPhone.tel = phoneNumber;
});

const setTimer = () => {
  let dateNow = new Date();
  if (!localStorage.getItem("time")) {
    startTimer(fullTime.value);
    localStorage.setItem(
      "time",
      JSON.stringify({
        date: dateNow.getTime() + 90000,
      })
    );
  } else {
    let { date } = JSON.parse(localStorage.getItem("time"));
    let timeEnd = date - dateNow.getTime();
    const totalSeconds = Math.floor(timeEnd / 1000);
    if (totalSeconds > 0) {
      const minutesConvert = "0" + Math.floor(totalSeconds / 60);
      const secondsConvert =
        totalSeconds % 60 < 10 ? `0${totalSeconds % 60}` : totalSeconds % 60;

      minutes.value = minutesConvert;
      sec.value = secondsConvert;

      startTimer(totalSeconds);
    } else {
      minutes.value = "00";
      sec.value = "00";
      isFinishTimer.value = true;
    }
  }
};

const startTimer = (totalTime) => {
  timer = setInterval(() => {
    totalTime--;
    minutes.value = "0" + Math.floor(totalTime / 60);
    sec.value = totalTime % 60 < 10 ? `0${totalTime % 60}` : totalTime % 60;
    if (totalTime <= 0) {
      clearInterval(timer);
      isFinishTimer.value = true;
    }
  }, 1000);
};
</script>

<style lang="scss" scoped>
.code {
  width: min-content;
  margin: auto;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.3), 0 1px 5px -1px rgba(0, 0, 0, 0.3);
  &-wrapper {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: cenetr;
  }
}

.code-title {
  font-weight: 700;
  font-size: 24px;
}
.code-back {
  height: 20px;
  font-size: 18px;
}
.code-text {
  color: black;
  margin-bottom: 10px;
  font-size: 13px;
  line-height: 1.5;
}
.code-number {
  white-space: nowrap;
  font-weight: 600;
}
.code-change {
  color: rgb(104, 138, 250);
  margin-left: 10px;
  font-weight: 500;
}
.code-otp {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-direction: column;
  margin: 20px 0 5px 0;
  position: relative;
  z-index: 0;
  .error {
    z-index: -1;
    top: auto;
    bottom: 0;
  }
  .fade-enter-from,
  .fade-leave-to {
    top: auto;
    bottom: 50%;
  }
}
.code-new {
  // margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
  &-timer {
    color: rgb(163, 163, 163);
  }
  &-btn {
    font-size: 13px;
    font-weight: 500;
    color: rgb(104, 138, 250);
  }
}
.code-checkbox {
  display: flex;
  gap: 10px;
  font-size: 12px;
  line-height: 1.3;
  margin-bottom: 10px;
  color: rgb(88, 88, 88);
  position: relative;
  z-index: 0;
  &.invalid {
    padding-bottom: 15px;
  }
  label {
    background-color: #fff;
  }
  .error {
    top: auto;
    left: 24px;
    bottom: 0;
  }
  .fade-enter-from,
  .fade-leave-to {
    top: auto;
    bottom: 50%;
  }
}
.code-sms {
  display: block;
  font-size: 13px;
  color: rgb(86, 125, 255);
  font-weight: 500;
  margin: 20px auto 0;
}
.code-signup {
  margin: 30px auto 0;
  transition: 0.3s all;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  &:disabled {
    opacity: 1;
    filter: brightness(0.8);
  }
  &-icon {
    height: 20px;
    width: min-content;
  }
}

.modal-sms {
  max-width: 400px;
  padding: 20px;
}
.modal-sms-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.modal-sms-title {
  font-size: 20px;
  font-weight: 700;
}
.modal-sms-close {
  color: grey;
  font-size: 20px;
}
.modal-sms-text {
}
</style>
<style lang="scss">
.otp-input {
  width: 50px;
  height: 50px;
  padding: 5px;
  margin: 0 5px;
  font-size: 20px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: 0.3s all;
}
.otp-input-container {
  margin-bottom: 0px;
  z-index: 10;
  background-color: #fff;
}
.otp-input-container.invalid {
  margin-bottom: 25px;
  .otp-input {
    border: 1px solid rgb(240, 102, 102);
    box-shadow: inset 0 1px 1px #00000013, 0 0 8px rgb(240, 102, 102);
  }
}
/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: #e1eff3;
  border: 1px solid #23c5ee;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}

.code {
  .p-card-title {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 15px;
  }

  .p-checkbox {
    width: 14px;
    height: 14px;
    margin-top: 2px;
  }
  .p-checkbox .p-checkbox-box {
    width: 14px;
    height: 14px;
    color: #334155;
    border-radius: 3px;
    svg {
      height: 10px;
    }
  }
  .p-button {
    font-size: 14px;
  }
}
</style>
