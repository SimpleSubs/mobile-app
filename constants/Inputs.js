// Regular expression to detect if a given string is a valid email address
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// String to signal to validated inputs that input contents are valid
export const NO_ERROR = "NO_ERROR";

// Different options for input
export const InputTypes = {
  CHECKBOX: "CHECKBOX",
  PICKER: "PICKER",
  TEXT_INPUT: "TEXT_INPUT"
};

/**
 * Determines if a value in user's profile is valid.
 */
export const valueIsValid = (userField, value) => {
  if (value === null || value === undefined) {
    return !userField.required;
  }
  switch (userField.inputType) {
    case (InputTypes.TEXT_INPUT):
      // Must be valid based on text type (e.g. "EMAIL" text type must be valid email)
      return InputPresets[userField.textType]?.validate(value) === NO_ERROR;
    case (InputTypes.PICKER):
      // Must be a value contained in options
      return userField.options.includes(value);
    case (InputTypes.CHECKBOX):
      // All values must be in options
      return value.map((option) => userField.options.includes(option)).reduce((a, b) => a && b);
    default:
      // THIS SHOULD NEVER HAPPEN (but consider input valid if inputType is invalid)
      return true;
  }
};

/**
 * Determines if a user's profile contains any invalid values (i.e. if userFields has changed).
 */
export const allValid = (user, userFields) => (
  userFields
    .map((userField) => valueIsValid(userField, user ? user[userField.key] : null))
    .reduce((a, b) => a && b, true)
);

// Presets for different types of text (for text input)
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
  CODE: {
    autoCorrect: false,
    maxLength: 6,
    fixValue: (value) => value.trim().toUpperCase(),
    validate: (value) => value.length === 6 ? NO_ERROR : "Code must be exactly 6 digits"
  },
  NAME: {
    autoCapitalize: "words",
    autoCompleteType: "name",
    textContentType: "name",
    fixValue: (value) => value.trim(),
    validate: (value) => NO_ERROR
  },
  MULTILINE: {
    multiline: true,
    fixValue: (value) => value.trim(),
    validate: (value) => NO_ERROR
  },
  PLAIN: {
    fixValue: (value) => value.trim(),
    validate: (value) => NO_ERROR
  }
};

// Options for text type presets (see above)
export const TextTypes = {
  EMAIL: "EMAIL",
  PASSWORD: "PASSWORD",
  NEW_PASSWORD: "NEW_PASSWORD",
  CONFIRM_PASSWORD: "CONFIRM_PASSWORD",
  PIN: "PIN",
  CODE: "CODE",
  NAME: "NAME",
  MULTILINE: "MULTILINE",
  PLAIN: "PLAIN"
};