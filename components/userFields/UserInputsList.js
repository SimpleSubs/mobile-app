import React from "react";
import {
  Text,
  View,
  Keyboard
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { ValidatedPicker, ValidatedTextInput } from "./ValidatedInputs";
import Layout from "../../constants/Layout";
import createStyleSheet, { getColors } from "../../constants/Colors";
import { TextTypes, InputPresets, InputTypes } from "../../constants/Inputs";
import { useSelector } from "react-redux";

// Placeholder for a non-editable password value
const PASSWORD_PLACEHOLDER = "********";

const CustomTextInput = ({ editing, value = "", item, inputRefs, addRef, submit, index, state, setState }) => {
  const themedStyles = createStyleSheet(styles);
  const thisInput = (
    <ValidatedTextInput
      placeholder={item.placeholder}
      required={item.required}
      placeholderTextColor={getColors().textInputText}
      returnKeyType={inputRefs.length > index + 1 ? "next" : "go"}
      value={editing && item.textType === TextTypes.PASSWORD ? PASSWORD_PLACEHOLDER : value}
      fixValue={InputPresets[item.textType].fixValue}
      onChangeText={(text) => setState({ [item.key]: text })}
      onSubmitEditing={() => {
        if (inputRefs.length > index + 1) {
          if (inputRefs[index + 1].canFocus) {
            inputRefs[index + 1].ref.focus();
          }
        } else {
          submit();
        }
      }}
      editable={editing && item.mutable && item.textType !== TextTypes.PASSWORD}
      otherInputs={item.key === "confirmPassword" ? [state.password || ""] : []}
      setRef={(ref, validate) => addRef(item.key, ref, index, validate, true)}
      contentContainerStyle={editing && themedStyles.inputContentContainer}
      style={editing && (
        item.EditButton || !item.mutable
          ? themedStyles.nonEditableInput
          : themedStyles.editableTextInput
      )}
      {...InputPresets[item.textType]}
    />
  );
  return (
    editing ? (
      <View style={themedStyles.fieldContainer}>
        <Text style={themedStyles.title}>{item.title}</Text>
        <View style={themedStyles.textInputButtonContainer}>
          {thisInput}
          {item.EditButton && <item.EditButton />}
        </View>
      </View>
    ) : thisInput
  );
}

const CustomPickerTouchable = ({ editing, value, item, setState, addRef, index }) => {
  const themedStyles = createStyleSheet(styles);
  const picker = (
    <ValidatedPicker
      setRef={(ref, validate) => addRef(item.key, ref, index, validate, false)}
      value={value}
      onValueChange={(value) => setState({ [item.key]: value })}
      options={item.options}
      required={item.required}
      style={editing && !item.mutable
        ? { ...themedStyles.editableTextInput, ...themedStyles.nonEditableInput }
        : (editing ? themedStyles.editableTextInput : {})
      }
      contentContainerStyle={editing && themedStyles.inputContentContainer}
      disabled={editing && !item.mutable}
    />
  )
  return editing ? (
    <View style={themedStyles.fieldContainer}>
      <Text style={themedStyles.title}>{item.title}</Text>
      <View style={themedStyles.textInputButtonContainer}>{picker}</View>
    </View>
  ) : picker;
}

/**
 * Validated input to render within inputs list
 */
const Input = ({ editing, item, index, inputRefs, addRef, submit, state, setState }) => {
  switch (item.inputType) {
    case InputTypes.TEXT_INPUT:
      return (
        <CustomTextInput
          editing={editing}
          value={state[item.key]}
          item={item}
          inputRefs={inputRefs}
          addRef={addRef}
          submit={submit}
          index={index}
          state={state}
          setState={setState}
        />
      );
    case InputTypes.PICKER:
      return (
        <CustomPickerTouchable
          editing={editing}
          value={state[item.key] || item.placeholder}
          item={item}
          setState={setState}
          addRef={addRef}
          index={index}
        />
      );
    default:
      return null;
  }
};

/**
 * A list that renders various validated inputs to create and edit user data.
 */
const UserInputsList = ({ data, state, setInputs, onSubmit, editing, SubmitButton = () => null, ListFooterComponent = () => null, ListFooterComponentStyle = {}, contentContainerStyle = {}, ...props }) => {
  const loading = useSelector(({ loading }) => loading.value);
  const [inputRefs, setInputRefs] = React.useState([]);
  const themedStyles = createStyleSheet(styles);

  const setState = (newState) => setInputs((prevState) => ({ ...prevState, ...newState }));

  const addRef = (key, newRef, index, validate, canFocus) => {
    setInputRefs((prevState) => {
      let newState = prevState;
      newState[index] = { key, ref: newRef, validate, canFocus };
      return newState;
    })
  };

  const getSubmitState = (state) => {
    let submitState = {}
    for (let item of data) {
      let value = state[item.key];
      switch (item.inputType) {
        case (InputTypes.TEXT_INPUT):
          submitState[item.key] = value ? InputPresets[item.textType].fixValue(value) : "";
          break;
        case (InputTypes.PICKER):
          submitState[item.key] = value || "";
          break;
        case (InputTypes.CHECKBOX):
          submitState[item.key] = value || [];
          break;
        default:
          break;
      }
    }
    return submitState;
  }

  const submit = () => {
    // Valid if
    //    1. user is in editing mode and
    //      a. field is immutable (therefore user cannot change it) or
    //      b. field has a specific edit action (e.g. "CHANGE_PASSWORD")
    //    OR if
    //    2. validation of field returns true
    let valid = inputRefs.map(({ key, validate }, index) => (
      (editing && (!data[index].mutable || data[index].editAction)) ||
      validate(state[key] || "")
    )).reduce((a, b) => a && b);
    if (valid) {
      Keyboard.dismiss();
      onSubmit(getSubmitState(state));
    }
  };

  return (
    <KeyboardAwareFlatList
      {...props}
      keyboardOpeningTime={0}
      extraScrollHeight={50}
      alwaysBounceVertical={false}
      keyboardDismissMode={Layout.ios ? "interactive" : "on-drag"}
      contentContainerStyle={[themedStyles.contentContainer, contentContainerStyle]}
      data={data}
      extraData={[state, inputRefs]}
      ListFooterComponent={() => (
        <View style={[themedStyles.footer, ListFooterComponentStyle]}>
          <ListFooterComponent />
          <SubmitButton onPress={submit} loading={loading} />
        </View>
      )}
      ListFooterComponentStyle={themedStyles.footerContainer}
      renderItem={({ item, index }) => (
        <Input
          editing={editing}
          item={item}
          index={index}
          inputRefs={inputRefs}
          addRef={addRef}
          submit={submit}
          state={state}
          setState={setState}
        />
      )}
    />
  )
};

export default UserInputsList;

const styles = (Colors) => ({
  contentContainer: {
    alignItems: "stretch",
    paddingHorizontal: 50
  },
  footerContainer: {
    flexGrow: 1
  },
  footer: {
    alignItems: "stretch",
    justifyContent: "space-between",
    flexGrow: 1
  },
  fieldContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flexGrow: 1
  },
  title: {
    fontFamily: "josefin-sans-bold",
    color: Colors.primaryText,
    fontSize: Layout.fonts.title,
    flex: 1,
    marginBottom: 18
  },
  textInputButtonContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  inputContentContainer: {
    flex: 1
  },
  editableTextInput: {
    backgroundColor: Colors.mode === "LIGHT" ? Colors.darkerTextInputColor : Colors.backgroundColor
  },
  nonEditableInput: {
    backgroundColor: "transparent"
  }
});