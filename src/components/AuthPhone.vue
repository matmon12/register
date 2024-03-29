<template>
  <Button @click="authPhone.modalVisible = true" class="signup-phone">
    <i-ic:baseline-phone class="signup-phone-icon" />
    <span class="signup-phone-text">Номер телефона</span>
  </Button>

  <Dialog
    class="modal"
    v-model:visible="authPhone.modalVisible"
    modal
    header="Введите номер телефона"
  >
    <p class="modal-text">Мы отправим код. Код должен прийти в СМС</p>
    <div class="modal-phone-wrapper">
      <vue-tel-input
        v-model="tel"
        v-bind="vueTel.props"
        :class="{ 'is-invalid': errors.tel }"
        ref="telInput"
      ></vue-tel-input>
      <transition name="fade">
        <small class="error" v-if="errors.tel">
          {{ errors.tel }}
        </small>
      </transition>
      <Button
        class="modal-btn"
        @click="onSubmit"
        :disabled="errors.tel || authPhone.loadingNumber"
      >
        <i-svg-spinners:180-ring class="modal-btn-icon" v-if="authPhone.loadingNumber"/>
        Отправить код
      </Button>
    </div>
    <a class="modal-other" href="#">Войти по почте</a>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useField, useForm } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import { useAuthPhoneStore } from "@/stores/authPhone";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const rulesStore = useRulesStore();
const authPhone = useAuthPhoneStore();
const toast = useToast();
const router = useRouter();

const vueTel = {
  props: {
    preferredCountries: ["RU", "UK", "FR"],
    mode: "international",
    inputOptions: {
      maxlength: 12,
      placeholder: "999 999 99 99",
      autofocus: true,
    },
    dropdownOptions: {
      showFlags: true,
      showSearchBox: true,
      showDialCodeInSelection: true,
    },
    wrapperClasses: "country-phone-input",
    validCharactersOnly: true,
  },
};

// validate
const { defineField, handleSubmit, resetForm, resetField, errors } = useForm({
  validationSchema: rulesStore.schemaPhone,
});
const [tel] = defineField("tel");
const telInput = ref(null);

const onSubmit = handleSubmit((values) => {
  authPhone.tel = values.tel;
  localStorage.setItem(
    "phone",
    JSON.stringify({
      phoneNumber: authPhone.tel,
    })
  );
  localStorage.removeItem("time");
  authPhone
    .sendCode(authPhone.tel)
    .then(() => {
      router.push("/register/verifier");
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
    })
    .finally(() => {
      authPhone.modalVisible = false;
    });
});
</script>

<style lang="scss" scoped>
.signup-phone {
  display: flex;
  justify-content: center;
  gap: 10px;
  height: 44px;
  background-color: #fff;
  border: 2px solid #9ab2ff;
  &:hover {
    background-color: #9ab2ff;
  }
}
.signup-phone-icon {
  height: 20px;
  width: auto;
  color: rgb(34, 112, 255);
}
.signup-phone-text {
  color: #000;
  font-weight: 500;
}

.modal-phone-wrapper {
  position: relative;
  z-index: 0;
}
.modal {
  .error {
    z-index: -1;
    top: auto;
    bottom: -20px;
  }
  .fade-enter-from,
  .fade-leave-to {
    top: auto;
    bottom: 10%;
  }
}
.modal-btn {
  margin: 10px auto 0;
  width: 100%;
  height: 44px;
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
.modal-text {
  font-size: 13px;
  margin-bottom: 10px;
}
.modal-other {
  font-size: 14px;
  display: block;
  width: fit-content;
  margin: auto auto 0;
  color: rgb(59, 116, 223);
}
</style>
<style lang="scss">
.modal {
  height: 400px;
  display: flex;
  .p-dialog-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.modal {
  .vue-tel-input {
    border-radius: 7px;
    border: 1px solid #bbb;
    height: 44px;
    position: relative;
    background-color: #fff;
    &.is-invalid {
      border: 1px solid rgb(240, 102, 102);
      &:focus-within {
        box-shadow: inset 0 1px 1px #00000013, 0 0 8px rgb(240, 102, 102);
      }
    }
  }
  .vti__dropdown {
    padding: 5px;
    position: static;
    border-radius: 7px;
    &.open {
      background-color: #fff;
      .vti__dropdown-arrow {
        transform: rotate(180deg) scaleY(1);
      }
    }
  }
  .vti__selection {
    font-size: 0.8em;
    gap: 5px;
    background-color: rgb(170, 207, 255);
    flex-grow: 1;
    border-radius: 5px;
    padding: 5px 10px 5px 5px;
    .vti__dropdown-arrow {
      color: #000;
      visibility: hidden;
      position: relative;
      transition: 0.3s all;
      transform: scaleY(1);
      height: 100%;
      width: 20px;
      &::after {
        content: url("@/img/arrow-2.svg");
        visibility: visible;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .vti__flag.ru {
    height: 14px;
    border-radius: 2px;
  }
  .vti__selection .vti__country-code {
    color: #000;
  }
  .vti__dropdown-arrow {
    color: #000;
    visibility: hidden;
    position: relative;
    transition: 0.3s all;
    transform: scaleY(1);
    height: 100%;
    width: 20px;
    &::after {
      content: url("@/img/arrow-2.svg");
      visibility: visible;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .vti__input {
    border-radius: 0 2px 2px 0;
    padding-left: 7px;
    color: #000;
    &::placeholder {
      font-weight: 400;
      text-align: start;
    }
  }

  .vti__dropdown-list.below {
    top: calc(100% + 1px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 7px;
      display: none;
    }

    &::-webkit-scrollbar-track {
      background: rgb(202, 202, 202);
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgb(117, 117, 117); /* цвет бегунка */
      border-radius: 20px; /* округлось бегунка */
      border: 3px solid rgb(117, 117, 117); /* отступ вокруг бегунка */
    }
  }
  .vti__dropdown-list {
    z-index: 1;
    border-radius: 10px;
    width: 100%;
  }
  .vti__search_box {
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 97%;
    padding: 7px;
    margin: 5px;
  }
  .vti__dropdown-item {
    padding: 6px 15px;
    strong {
      font-weight: 500;
      font-size: 14px;
    }
  }
  .vti__dropdown-item .vti__flag {
    margin-right: 10px;
  }
}
</style>
