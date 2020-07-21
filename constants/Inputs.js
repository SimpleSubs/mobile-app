const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const NO_ERROR = "   ";

export const InputTypes = {
  CHECKBOX: "CHECKBOX",
  PICKER: "PICKER",
  TEXT_INPUT: "TEXT_INPUT"
};

export const InputPresets = {
  EMAIL: {
    autoCompleteType: "email",
    keyboardType: "email-address",
    textContentType: "emailAddress",
    autoCapitalize: "none",
    fixValue: (value) => value.trim(),
    validate: (value) => EMAIL_REGEX.test(value) ? NO_ERROR : "Please enter a valid email address"
  },
  PASSWORD: {
    autoCompleteType: "password",
    secureTextEntry: true,
    textContentType: "password",
    autoCorrect: false,
    fixValue: (value) => value,
    validate: (value) => NO_ERROR
  },
  NEW_PASSWORD: {
    autoCompleteType: "password",
    secureTextEntry: true,
    textContentType: "newPassword",
    passwordRules: "minlength: 8;",
    autoCorrect: false,
    fixValue: (value) => value,
    validate: (value) => value.length >= 8 ? NO_ERROR : "Value must be at least 8 characters"
  },
  CONFIRM_PASSWORD: {
    autoCompleteType: "password",
    secureTextEntry: true,
    textContentType: "password",
    autoCorrect: false,
    fixValue: (value) => value,
    validate: (value, prevValue) => value === prevValue ? NO_ERROR : "Password values must match"
  },
  PIN: {
    autoCorrect: false,
    keyboardType: "numeric",
    maxLength: 4,
    fixValue: (value) => value,
    validate: (value) => value.length === 4 && !isNaN(parseInt(value, 10)) ? NO_ERROR : "Invalid PIN"
  },
  NAME: {
    autoCapitalize: "words",
    autoCompleteType: "name",
    textContentType: "name",
    fixValue: (value) => value.trim(),
    validate: (value) => NO_ERROR
  },
  PLAIN: {
    fixValue: (value) => value.trim(),
    validate: (value) => NO_ERROR
  }
};

export const TextTypes = {
  EMAIL: "EMAIL",
  PASSWORD: "PASSWORD",
  NEW_PASSWORD: "NEW_PASSWORD",
  CONFIRM_PASSWORD: "CONFIRM_PASSWORD",
  PIN: "PIN",
  NAME: "NAME",
  PLAIN: "PLAIN"
};