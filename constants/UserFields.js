const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const INPUT_TYPES = {
  TEXT_INPUT: "TEXT_INPUT",
  PICKER: "PICKER"
}

export const TYPE_MAPS = {
  email: {
    inputType: INPUT_TYPES.TEXT_INPUT,
    autoCompleteType: "email",
    keyboardType: "email-address",
    textContentType: "emailAddress",
    autoCapitalize: "none",
    fixValue: (value) => value.trim(),
    validate: (value) => EMAIL_REGEX.test(value) ? "" : "Please enter a valid email address",
    settingsEditable: false
  },
  password: {
    inputType: INPUT_TYPES.TEXT_INPUT,
    autoCompleteType: "password",
    secureTextEntry: true,
    textContentType: "password",
    autoCorrect: false,
    fixValue: (value) => value,
    validate: (value) => "",
    settingsEditable: true,
    verifyEditable: true
  },
  newPassword: {
    inputType: INPUT_TYPES.TEXT_INPUT,
    autoCompleteType: "password",
    secureTextEntry: true,
    textContentType: "newPassword",
    passwordRules: "minlength: 8;",
    autoCorrect: false,
    fixValue: (value) => value,
    validate: (value) => value.length >= 8 ? "" : "Value must be at least 8 characters"
  },
  confirmPassword: {
    inputType: INPUT_TYPES.TEXT_INPUT,
    autoCompleteType: "password",
    secureTextEntry: true,
    textContentType: "password",
    autoCorrect: false,
    fixValue: (value) => value,
    validate: (value, prevValue) => value === prevValue ? "" : "Password values must match"
  },
  pin: {
    inputType: INPUT_TYPES.TEXT_INPUT,
    autoCompleteType: "password",
    textContentType: "password",
    autoCorrect: false,
    keyboardType: "numeric",
    maxLength: 4,
    fixValue: (value) => value,
    validate: (value) => value.length === 4 && !isNaN(parseInt(value, 10)) ? "" : "Invalid PIN",
    settingsEditable: false
  },
  name: {
    inputType: INPUT_TYPES.TEXT_INPUT,
    autoCapitalize: "words",
    autoCompleteType: "name",
    textContentType: "name",
    fixValue: (value) => value.trim(),
    validate: (value) => "",
    settingsEditable: true
  },
  grade: {
    inputType: INPUT_TYPES.PICKER,
    options: ["9", "10", "11", "12", "Faculty"],
    settingsEditable: true
  }
};

const UserFields = [
  { key: "email", title: "Email", placeholder: "Email", type: "email" },
  { key: "password", title: "Password", placeholder: "Password", type: "password" },
  { key: "name", title: "Name", placeholder: "First and last name", type: "name" },
  { key: "grade", title: "Grade", placeholder: "Please select", type: "grade" },
  { key: "pin", title: "PIN", placeholder: "Caf PIN", type: "pin" }
]

const passwordIndex = UserFields.findIndex(({ type }) => type === "password");
let RegisterUserFields = [...UserFields];
if (passwordIndex !== -1) {
  RegisterUserFields.splice(
    passwordIndex,
    1,
    { key: "password", title: "Password", placeholder: "Password", type: "newPassword" },
    { key: "confirmPassword", title: "Confirm password", placeholder: "Confirm password", type: "confirmPassword" }
  )
}

export { RegisterUserFields };
export const LoginUserFields = UserFields.filter(({ key }) => key === "email" || key === "password");
export default UserFields;