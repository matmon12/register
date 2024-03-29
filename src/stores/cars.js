import { ref } from "vue";
import { defineStore } from "pinia";
import axiosApiInstance from "../api";
import { useQuery, useMutation } from "vue-query";
import { useToast } from "primevue/usetoast";
import {
  getDatabase,
  ref as firebaseRef,
  set,
  push,
  child,
  remove,
  update,
} from "firebase/database";
import { validate } from "uuid";

export const useCarsStore = defineStore("store", () => {
  const cars = ref([]);
  const toast = useToast();
  const db = getDatabase();

  // получение
  const fetchCars = async () => {
    return await axiosApiInstance
      .get(
        `https://jwt-firebase-vue3-e771d-default-rtdb.europe-west1.firebasedatabase.app/cars.json`
      )
      .then((res) => {
        if (res.data) {
          const arr = Object.values(res.data);
          cars.value = arr;
        }
      });
  };
  function useCarsQuery() {
    return useQuery("cars", fetchCars, {
      refetchOnWindowFocus: true,
      retry: 1,
    });
  }

  // отправка
  function useAddCarsMutation(email, password, id) {
    return useMutation(
      ({ email, password, id }) => {
        // const key = push(child(firebaseRef(db), 'cars')).key;
        set(firebaseRef(db, "cars/" + id), {
          name: email,
          type: password,
          id: id,
        });

        cars.value.push({
          id: id,
          name: email,
          type: password,
        });
      },
      {
        onError: (error, variables, context) => {},
        onSuccess: (data, variables, context) => {},
      }
    );
  }

  // delete
  const removeCar = async (id) => {
    await remove(firebaseRef(db, "cars/" + id)).catch((error) => {
      throw error;
    });
  };

  // edit
  const editCar = async (id, email, password) => {
    const updateData = {
      id: id,
      name: email,
      type: password,
    };
    const updates = {};
    updates["/cars/" + id] = updateData;
    await update(firebaseRef(db), updates).catch((error) => {
      throw error;
    });
  };

  return { cars, useCarsQuery, useAddCarsMutation, removeCar, editCar };
});
