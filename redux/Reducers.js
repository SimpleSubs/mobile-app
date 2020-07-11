import Actions from "./Actions";
import InputTypes from "../constants/InputTypes";
import { combineReducers } from "redux";
import { NO_ERROR } from "../components/ValidatedInput";

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ORDER_OPTIONS = [
  {
    title: "Bread",
    type: InputTypes.picker,
    key: "bread",
    options: ["dutch crunch", "sourdough roll", "ciabatta roll", "sliced wheat", "sliced sourdough", "gluten free"],
    required: true
  },
  {
    title: "Meat",
    type: InputTypes.checkbox,
    key: "meat",
    options: ["turkey", "roast beef", "pastrami", "salami", "ham", "tuna salad", "egg salad"]
  },
  {
    title: "Cheese",
    type: InputTypes.checkbox,
    key: "cheese",
    options: ["provolone", "swiss", "cheddar", "fresh mozzarella"]
  },
  {
    title: "Condiments",
    type: InputTypes.checkbox,
    key: "condiments",
    options: ["mayo", "mustard", "pesto", "red vin/olive oil", "balsamic vin/olive oil", "roasted red peppers",
      "pepperoncini", "pickles", "basil", "lettuce", "tomatoes", "hummus", "red onions", "jalapenos",
      "artichoke hearts"],
  },
  {
    title: "Extras",
    type: InputTypes.checkbox,
    key: "extras",
    options: ["avocado", "bacon", "meat"]
  }
];

const USER_FIELDS = [
  {
    key: "email",
    title: "Email",
    placeholder: "Email",
    mutable: false,
    inputType: InputTypes.textInput,
    textType: "email"
  },
  {
    key: "password",
    title: "Password",
    placeholder: "Password",
    mutable: true,
    inputType: InputTypes.textInput,
    textType: "password"
  },
  {
    key: "name",
    title: "Name",
    placeholder: "First and last name",
    mutable: true,
    inputType: InputTypes.textInput,
    textType: "name"
  },
  {
    key: "grade",
    title: "Grade",
    placeholder: "Please select",
    mutable: true,
    inputType: InputTypes.picker,
    options: ["9", "10", "11", "12", "Faculty"]
  },
  {
    key: "pin",
    title: "PIN",
    placeholder: "Caf PIN",
    mutable: false,
    inputType: InputTypes.textInput,
    textType: "pin"
  }
];

const INPUT_PRESETS = {
  email: {
    autoCompleteType: "email",
    keyboardType: "email-address",
    textContentType: "emailAddress",
    autoCapitalize: "none",
    fixValue: (value) => value.trim(),
    validate: (value) => EMAIL_REGEX.test(value) ? NO_ERROR : "Please enter a valid email address"
  },
  password: {
    autoCompleteType: "password",
    secureTextEntry: true,
    textContentType: "password",
    autoCorrect: false,
    fixValue: (value) => value,
    validate: (value) => NO_ERROR
  },
  newPassword: {
    autoCompleteType: "password",
    secureTextEntry: true,
    textContentType: "newPassword",
    passwordRules: "minlength: 8;",
    autoCorrect: false,
    fixValue: (value) => value,
    validate: (value) => value.length >= 8 ? NO_ERROR : "Value must be at least 8 characters"
  },
  confirmPassword: {
    autoCompleteType: "password",
    secureTextEntry: true,
    textContentType: "password",
    autoCorrect: false,
    fixValue: (value) => value,
    validate: (value, prevValue) => value === prevValue ? NO_ERROR : "Password values must match"
  },
  pin: {
    autoCorrect: false,
    keyboardType: "numeric",
    maxLength: 4,
    fixValue: (value) => value,
    validate: (value) => value.length === 4 && !isNaN(parseInt(value, 10)) ? NO_ERROR : "Invalid PIN"
  },
  name: {
    autoCapitalize: "words",
    autoCompleteType: "name",
    textContentType: "name",
    fixValue: (value) => value.trim(),
    validate: (value) => NO_ERROR
  },
  plain: {
    fixValue: (value) => value.trim(),
    validate: (value) => NO_ERROR
  }
};

const EXAMPLE_USER = {
  uid: "iuasjdhf82783w75830-3w5ytuwrshtgjf-102q-4wrti4eirgd",
  email: "emily@sturman.org",
  password: "********",
  name: "Emily Sturman",
  grade: "11",
  pin: "1234"
}

const initialStateConstants = {
  orderOptions: ORDER_OPTIONS,
  userFields: USER_FIELDS,
  inputPresets: INPUT_PRESETS
}

const orders = (state = {}, action) => {
  switch (action.type) {
    case Actions.EDIT_ORDER:
      return {
        ...state,
        [action.id]: action.data
      }
    case Actions.DELETE_ORDER:
      return Object.keys(state).reduce((object, key) => {
        if (key !== action.id) { object[key] = state[key] }
        return object;
      }, {});
    default:
      return state;
  }
}

const focusedOrder = (state = null, action) => (
  action.type === Actions.FOCUS_ORDER ? action.id : state
);

const user = (state = null, action) => {
  switch (action.type) {
    case Actions.LOG_IN:
      return EXAMPLE_USER;
    case Actions.LOG_OUT:
      return null;
    case Actions.EDIT_USER_DATA:
      if (state) {
        return {
          ...state,
          ...action.data
        };
      }
      return action.data;
    case Actions.CREATE_USER:
      return action.data;
    default:
      return state;
  }
}

const modal = (state = {}, action) => action.type === Actions.SET_MODAL_PROPS
  ? { ...state, ...action.props }
  : state;

const infoMessage = (state = "", action) => action.type === Actions.SET_INFO_MESSAGE
  ? action.message
  : state;

const stateConstants = (state = initialStateConstants, action) => state;

const sandwichApp = combineReducers({
  orders,
  focusedOrder,
  user,
  modal,
  infoMessage,
  stateConstants
})

export default sandwichApp;