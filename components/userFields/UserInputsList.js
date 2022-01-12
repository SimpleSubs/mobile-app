/**
 * @file Creates form for user data (register, settings screens, etc.).
 * @author Emily Sturman <emily@sturman.org>
 */
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Keyboard
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { ValidatedPicker, ValidatedTextInput } from "./ValidatedInputs";
import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";
import { TextTypes, InputPresets, InputTypes } from "../../constants/Inputs";
import { closeModal, openModal, setModalProps, changePassword } from "../../redux/Actions";
import { connect } from "react-redux";

// Placeholder for a non-editable password value
const PASSWORD_PLACEHOLDER = "********";

/**
 * Returns validated text input to render within inputs list.
 *
 * Input may contain title field and edit button.
 *
 * @param {boolean}     editing          Whether user is editing data or creating new data.
 * @param {string}      [value=]         Current value for text input.
 * @param {Object}      item             Object containing data for input.
 * @param {string}      item.placeholder Text input placeholder.
 * @param {string}      item.textType    Type of text (such as "EMAIL"); see TextTypes for a full list.
 * @param {string}      item.key         Key for input (used to access value in state)
 * @param {boolean}     item.mutable     Whether input is mutable after creation.
 * @param {string|null} item.EditButton  Key for an edit action to execute when edit button is pressed; null renders no button.
 * @param {string}      item.title       Title of field to display when editing.
 * @param {boolean}     item.required    Whether the field is required.
 * @param {Object[]}    inputRefs        Array of refs to inputs in inputs list.
 * @param {Function}    addRef           Adds a ref to inputRefs.
 * @param {Function}    submit           Submits data.
 * @param {number}      index            Index of input (starts at 0)
 * @param {Object}      state            Current values of inputs.
 * @param {Function}    setState         Sets values of inputs (only sets specified values; others remain the same).
 * @param {Function}    openModal        Opens top-level modal.
 * @param {Function}    closeModal       Closes top-level modal.
 * @param {Function}    setModalProps    Sets props for top-level modal.
 * @param {Function}    changePassword   Changes password using Firebase Auth.
 *
 * @return {React.ReactElement} Validated text input to render in inputs list.
 * @constructor
 */
const CustomTextInput = ({ editing, value = "", item, inputRefs, addRef, submit, index, state, setState, openModal, closeModal, setModalProps, changePassword }) => {
  const thisInput = (
    <ValidatedTextInput
      placeholder={item.placeholder}
      required={item.required}
      placeholderTextColor={Colors.textInputText}
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
      contentContainerStyle={editing && styles.inputContentContainer}
      style={editing && (
        item.EditButton || !item.mutable
          ? styles.nonEditableInput
          : styles.editableTextInput
      )}
      {...InputPresets[item.textType]}
    />
  );
  return (
    editing ? (
      <View style={styles.fieldContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.textInputButtonContainer}>
          {thisInput}
          {item.EditButton && (
            <item.EditButton
              openModal={openModal}
              closeModal={closeModal}
              setModalProps={setModalProps}
              changePassword={changePassword}
            />
          )}
        </View>
      </View>
    ) : thisInput
  );
}

/**
 * Returns validated picker touchable to render within inputs list.
 *
 * Picker may contain title field.
 *
 * @param {boolean}  editing       Whether user is editing data or creating new data.
 * @param {string}   value         Current value for picker.
 * @param {Object}   item          Object containing data for input.
 * @param {string[]} item.options  Options to display within picker.
 * @param {string}   item.key      Key for input (used to access value in state)
 * @param {boolean}  item.mutable  Whether input is mutable after creation.
 * @param {string}   item.title    Title of field to display when editing.
 * @param {boolean}  item.required Whether the field is required.
 * @param {Function} addRef        Adds a ref to inputRefs.
 * @param {number}   index         Index of input (starts at 0)
 * @param {Function} setState      Sets values of inputs (only sets specified values; others remain the same).
 *
 * @return {React.ReactElement} Validated picker touchable to render in inputs list.
 * @constructor
 */
const CustomPickerTouchable = ({ editing, value, item, setState, addRef, index }) => {
  const thisPicker = (
    <ValidatedPicker
      setRef={(ref, validate) => addRef(item.key, ref, index, validate, false)}
      value={value}
      onValueChange={(value) => setState({ [item.key]: value })}
      options={item.options}
      required={item.required}
      style={editing && !item.mutable
        ? { ...styles.editableTextInput, ...styles.nonEditableInput }
        : (editing ? styles.editableTextInput : {})
      }
      contentContainerStyle={editing && styles.inputContentContainer}
      disabled={editing && !item.mutable}
    />
  );
  return (
    editing ? (
      <View style={styles.fieldContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.textInputButtonContainer}>{thisPicker}</View>
      </View>
    ) : thisPicker
  );
}

/**
 * Returns validated input to render within inputs list.
 *
 * Input may contain title field and edit button.
 *
 * @param {boolean}     editing            Whether user is editing data or creating new data.
 * @param {Object}      item               Object containing data for input.
 * @param {string}      item.inputType     Type of input to render (e.g. "PICKER").
 * @param {string}      item.key           Key for input (used to access value in state)
 * @param {boolean}     item.mutable       Whether input is mutable after creation.
 * @param {string}      [item.placeholder] Text input placeholder; only necessary if input is a text input.
 * @param {string}      [item.textType]    Type of text (such as "EMAIL"); see TextTypes for a full list.=; only necessary if input is a text input.
 * @param {string|null} [item.EditButton]  Button component for a more complex editing action (such as changing a password); null renders no button; only necessary if input is a text input.
 * @param {string[]}    [item.options]     Options to display within picker; only necessary if input is a picker.
 * @param {string}      item.title         Title of field to display when editing.
 * @param {Object[]}    inputRefs          Array of refs to inputs in inputs list.
 * @param {Function}    addRef             Adds a ref to inputRefs.
 * @param {Function}    submit             Submits data.
 * @param {number}      index              Index of input (starts at 0)
 * @param {Object}      state              Current values of inputs.
 * @param {Function}    setState           Sets values of inputs (only sets specified values; others remain the same).
 * @param {Function}    openModal          Opens top-level modal.
 * @param {Function}    closeModal         Closes top-level modal.
 * @param {Function}    setModalProps      Sets props for top-level modal.
 * @param {Function}    changePassword     Changes password using Firebase Auth.
 *
 * @return {React.ReactElement|null} Validated input to render in inputs list; null if input type is invalid.
 * @constructor
 */
const Input = ({ editing, item, index, inputRefs, addRef, submit, state, setState, openModal, closeModal, setModalProps, changePassword }) => {
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
          openModal={openModal}
          closeModal={closeModal}
          setModalProps={setModalProps}
          changePassword={changePassword}
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
 * Returns a list that renders various validated inputs
 * to create and edit user data.
 *
 * Renders a touchable that opens a picker modal for
 * picker inputs and a text input with validation for
 * text inputs; can also display titles of fields if
 * editing data.
 *
 * @param {Object[]}                      data                                Array containing data to render each input.
 * @param {Object}                        state                               Current values of inputs.
 * @param {Function}                      setInputs                           Function to set the full state of inputs.
 * @param {Function}                      onSubmit                            Function to submit data once validated.
 * @param {Function}                      openModal                           Function to open top-level modal.
 * @param {Function}                      closeModal                          Function to close top-level modal.
 * @param {Function}                      setModalProps                       Function to set top-level modal props.
 * @param {boolean}                       editing                             Whether user is editing data or creating new data.
 * @param {Function}                      changePassword                      Changes password using Firebase Auth.
 * @param {boolean}                       loading                             Whether app is currently loading.
 * @param {React.Component|function:null} [SubmitButton=function:null]        Button to submit data (will be passed onPress and loading props)
 * @param {React.Component|function:null} [ListFooterComponent=function:null] Component to render beneath inputs list but above submit button
 * @param {Object}                        [ListFooterComponentStyle={}]       Style object to be applied to view containing submit button and ListFooterComponent
 * @param {Object}                        props                               Any other props to pass to FlatList.
 *
 * @return {React.ReactElement} Flat list containing validated inputs and submit button.
 * @constructor
 */
const UserInputsList = ({ data, state, setInputs, onSubmit, openModal, closeModal, setModalProps, editing, changePassword, loading, SubmitButton = () => null, ListFooterComponent = () => null, ListFooterComponentStyle = {}, ...props }) => {
  const [inputRefs, setInputRefs] = useState([]);

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
    // Valid if 1. user is in editing mode and a. field is immutable (therefore user cannot change it) or b. field has
    // a specific edit action (e.g. "CHANGE_PASSWORD") OR if 2. validation of field returns true.
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
      contentContainerStyle={[styles.contentContainer, props.contentContainerStyle || {}]}
      data={data}
      extraData={[state, inputRefs]}
      ListFooterComponent={() => (
        <View style={[styles.footer, ListFooterComponentStyle]}>
          <ListFooterComponent />
          <SubmitButton onPress={submit} loading={loading} />
        </View>
      )}
      ListFooterComponentStyle={styles.footerContainer}
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
          openModal={openModal}
          closeModal={closeModal}
          setModalProps={setModalProps}
          changePassword={changePassword}
        />
      )}
    />
  )
};

const mapStateToProps = ({ loading }) => ({
  loading
})

const mapDispatchToProps = (dispatch) => ({
  openModal: (props) => dispatch(openModal(props)),
  closeModal: () => dispatch(closeModal()),
  setModalProps: (props) => dispatch(setModalProps(props)),
  changePassword: (oldPassword, newPassword) => changePassword(dispatch, oldPassword, newPassword)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInputsList);

const styles = StyleSheet.create({
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