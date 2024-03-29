<template>
  <div class="cars">
    <h2 class="cars-title">Cars</h2>
    <form class="cars-form">
      <div class="cars-form-box" v-if="can('create', 'Post')">
        <InputGroup class="input-box">
          <InputGroupAddon>
            <i-icon-park-outline-write />
          </InputGroupAddon>
          <InputText
            placeholder="Username"
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
        <InputGroup class="input-box">
          <InputGroupAddon>
            <i-ph-note-pencil />
          </InputGroupAddon>
          <InputText
            placeholder="Username"
            v-model="password"
            aria-describedby="password-help"
            :class="{ 'p-invalid': errors.password }"
          />
          <transition name="fade">
            <small class="error" v-if="errors.password">
              {{ errors.password }}
            </small>
          </transition>
        </InputGroup>
        <Button
          label="Отправить"
          @click="onSubmit"
          class="cars-btn"
          :disabled="loadingPostCars"
        />
      </div>
    </form>
    <Card v-if="isIdle">
      <template #title>Сообщение</template>
      <template #content> Данные еще не получены. Нажмите на кнопку выше. </template>
    </Card>
    <Message severity="error" v-else-if="isError || isRefetchError">{{
      error.response.status === 404 ? "404 Не найдено" : error
    }}</Message>
    <div v-else>
      <Loader v-if="loadingCars || isRefetching" />
      <div class="cars__list" v-else v-auto-animate>
        <Card v-for="(item, id) in carsStore.cars" :key="item.id" class="cars__list-item">
          <template #title>{{ item.name }}</template>
          <template #content>
            {{ item.type }}
            <div class="cars-control">
              <Button
                class="cars-control-btn"
                @click="onDelete(item.id)"
                v-if="can('delete', 'Post')"
              >
                <i-svg-spinners:180-ring v-if="loadingDelete && index === id" />
                <i-pajamas:remove v-else />
              </Button>
              <Button
                class="cars-control-btn"
                outlined
                @click="onEdit(item.id, item.name, item.type)"
                v-if="can('update', 'Post')"
                ><i-lucide:edit
              /></Button>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="visibleModal" modal>
    <template #container="{ closeCallback }">
      <div class="modal-cars" v-on-click-outside="closeCallback">
        <div class="modal-cars-header">
          <p class="modal-cars-title">Редактирование информации</p>
          <button class="modal-cars-close" @click="closeCallback"><i-ion:close /></button>
        </div>
        <p class="modal-cars-text">Введите новые данные</p>
        <div class="modal-cars-inputgroup">
          <label for="car-email" class="modal-cars-label">Email:</label>
          <InputText id="car-email" v-model="modalInputEmail" />
        </div>
        <div class="modal-cars-inputgroup">
          <label for="car-password" class="modal-cars-label">Password:</label>
          <InputText id="car-password" v-model="modalInputPassword" />
        </div>
        <div class="modal-cars-btns">
          <Button type="button" severity="secondary" @click="closeCallback"
            >Отмена</Button
          >
          <Button class="modal-cars-btn" type="button" @click="saveChange()">
            <i-svg-spinners:180-ring v-if="loadingEdit" />
            <span>Сохранить</span>
          </Button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import { useForm } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import { useCarsStore } from "@/stores/cars";
import { useRolesStore } from "@/stores/roles";
import { useAbility } from "@casl/vue";
import { v4 as uuidv4 } from "uuid";
import { vOnClickOutside } from "@vueuse/components";
import { useToast } from "primevue/usetoast";

const rulesStore = useRulesStore();
const carsStore = useCarsStore();
const toast = useToast();
const cars = ref();
const loadingDelete = ref(false);
const loadingEdit = ref(false);
const index = ref();
const visibleModal = ref(false);
const modalInputEmail = ref();
const modalInputPassword = ref();
const currentId = ref();

// roles
const { can } = useAbility();

// vee validate
const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: rulesStore.schemaSignin,
});

const [email] = defineField("email");
const [password] = defineField("password");

const onSubmit = handleSubmit((values) => {
  addCars();
});

// vue query
// получение данных
const {
  isLoading: loadingCars,
  isError,
  data,
  error,
  refetch,
  isIdle,
  isRefetching,
  isRefetchError,
} = carsStore.useCarsQuery();

// отправка
const { isLoading: loadingPostCars, mutate } = carsStore.useAddCarsMutation();
function addCars() {
  mutate(
    {
      id: uuidv4(),
      title: "New Car",
      email: email.value,
      password: password.value,
    },
    {
      onSuccess: (data, variables, context) => {
        toast.add({
          severity: "success",
          summary: "Успех!",
          detail: "Данные добавлены успешно",
          life: 3000,
        });
      },
      onSettled: (data, error, variables, context) => {
        if (error) {
          toast.add({
            severity: "error",
            summary: "Ошибка!",
            detail: error.message,
            life: 3000,
          });
        }
        resetForm();
      },
    }
  );
}

const onDelete = (id) => {
  loadingDelete.value = true;
  carsStore
    .removeCar(id)
    .then(() => {
      index.value = carsStore.cars.findIndex((element) => element.id === id);
      carsStore.cars.splice(index.value, 1);

      toast.add({
        severity: "success",
        summary: "Успешно!",
        detail: "Запись успешно удалена",
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
      loadingDelete.value = false;
    });
};

const onEdit = (id, email, password) => {
  visibleModal.value = true;
  currentId.value = id;

  modalInputEmail.value = email;
  modalInputPassword.value = password;
};

const saveChange = () => {
  loadingEdit.value = true;
  carsStore
    .editCar(currentId.value, modalInputEmail.value, modalInputPassword.value)
    .then(() => {
      const indexUpdate = carsStore.cars.findIndex(
        (element) => element.id === currentId.value
      );
      carsStore.cars[indexUpdate].name = modalInputEmail.value;
      carsStore.cars[indexUpdate].type = modalInputPassword.value;

      toast.add({
        severity: "success",
        summary: "Успешно!",
        detail: "Данные успшено обновлены",
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
      visibleModal.value = false;
      loadingEdit.value = false;
    });
};
</script>

<style lang="scss" scoped>
.cars {
  margin-top: 50px;
  &__list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    &-item {
      position: relative;
      background-color: var(--color-main);
      color: var(--color-white);
      border: 1px solid #7c7c7c;
    }
  }
}
.cars-title {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 20px;
}
.cars-btn {
  margin-bottom: 20px;
}
.cars-form-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-box {
  position: relative;
}

.cars-control {
  display: flex;
  gap: 20px;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.cars-control-btn {
}

.modal-cars {
  padding: 20px;
  background-color: var(--color-main);
  border-radius: 12px;
  color: var(--color-white)
}
.modal-cars-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.modal-cars-title {
  font-size: 20px;
  font-weight: 500;
}
.modal-cars-text {
  color: grey;
  font-size: 16px;
  margin-bottom: 20px;
  font-size: 16px;
}
.modal-cars-inputgroup {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.modal-cars-label {
  font-size: 15px;
  font-weight: 500;
}
.modal-cars-btns {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
.modal-cars-btn {
  display: flex;
  gap: 10px;
}
.modal-cars-close {
  color: #929292;
  display: block;
  height: 20px;
  font-size: 20px;
}
</style>
<style lang="scss">
.modal-cars {
  width: 400px;
  .p-inputtext {
    border-radius: 6px;
  }
  .p-button {
    font-size: 14px;
  }
}
</style>
