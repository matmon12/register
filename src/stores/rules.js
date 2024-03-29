// import { ref } from "vue";
import { defineStore } from "pinia";
import { object, string, ref, boolean } from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
const emailRules = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const getCharacterValidationError = (message) => {
  return `Пароль должен содержать хотя бы 1 ${message} символ!`;
};

export const useRulesStore = defineStore("rules", () => {
  const schemaSignup = object({
    password: string()
      .required("Введите пароль!")
      .min(6, "Пароль должен содержать не менее 6 символов!")
      .matches(/[0-9]/, getCharacterValidationError("числовой"))
      // .matches(/[a-z]/, getCharacterValidationError("строчный"))
      // .matches(/[A-Z]/, getCharacterValidationError("заглавный"))
      .label("Password"),
    email: string()
      .required("Поле не должно быть пустым!")
      .test({
        name: "test",
        skipAbsent: true,
        test(value, ctx) {
          if (!emailRules.test(value)) {
            return ctx.createError({ message: "Email не валиден!" });
          }
          return true;
        },
      }),
    confirmPassword: string()
      .required("Введите пароль еще раз!")
      .oneOf([ref("password"), null], "Пароли не совпадают!"),
  });

  const schemaSignin = object({
    password: string()
      .required("Введите пароль!")
      .min(6, "Пароль должен содержать не менее 6 символов!")
      .matches(/[0-9]/, getCharacterValidationError("числовой"))
      // .matches(/[a-z]/, getCharacterValidationError("строчный"))
      // .matches(/[A-Z]/, getCharacterValidationError("заглавный"))
      .label("Password"),
    email: string()
      .required("Поле не должно быть пустым!")
      .test({
        name: "test",
        skipAbsent: true,
        test(value, ctx) {
          if (!emailRules.test(value)) {
            return ctx.createError({ message: "Email не валиден!" });
          }
          return true;
        },
      }),
  });

  const schemaPhone = object({
    tel: string()
      .required("Введите номер телефона!")
      .min(12, "Номер должен содержать не менее 11 цифр!"),
  });

  const schemaOTP = object({
    otp: string()
      .required("Введите код!")
      .min(6, "Код должен содержать 6 символов!"),
    checkbox: boolean().oneOf([true], "Необходимо отметить!"),
  });

  const schemaUpdatePassword = object({
    password: string()
      .required("Введите пароль!")
      .min(6, "Пароль должен содержать не менее 6 символов!")
      .matches(/[0-9]/, getCharacterValidationError("числовой"))
      // .matches(/[a-z]/, getCharacterValidationError("строчный"))
      // .matches(/[A-Z]/, getCharacterValidationError("заглавный"))
      .label("Password"),

    confirmPassword: string()
      .required("Введите пароль еще раз!")
      .oneOf([ref("password"), null], "Пароли не совпадают!"),
  });

  const schemaEmail = object({
    email: string()
      .required("Поле не должно быть пустым!")
      .test({
        name: "test",
        skipAbsent: true,
        test(value, ctx) {
          if (!emailRules.test(value)) {
            return ctx.createError({ message: "Email не валиден!" });
          }
          return true;
        },
      }),
  });

  return {
    schemaSignup,
    schemaSignin,
    schemaPhone,
    schemaOTP,
    schemaUpdatePassword,
    schemaEmail
  };
});
