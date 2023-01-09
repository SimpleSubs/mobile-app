import React from "react";
import {
  Text,
  View
} from "react-native";
import InputsList from "../userFields/UserInputsList";
import SubmitButton from "../userFields/SubmitButton";
import createStyleSheet from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { setModalProps } from "../../redux/features/display/modalSlice";
import { setReturnValue } from "../../redux/features/display/modalOperationsSlice";
import { useDispatch, useSelector } from "react-redux";
import ModalTypes, { ModalAnimationTypes } from "../../constants/ModalTypes";

/**
 * Modal containing validated inputs and submit button.
 */
const InputModal = ({ inputData, title, buttonTitle }) => {
  const { key } = useSelector(({ modalOperations }) => modalOperations);
  const dispatch = useDispatch();
  const [state, setState] = React.useState({});
  const themedStyles = createStyleSheet(styles);

  const onSubmit = (state) => dispatch(setReturnValue(state));

  React.useEffect(() => {
    if (!key && Object.keys(state).length > 0) {
      setState({});
    }
  }, [key]);

  return (
    <>
      <View style={themedStyles.spacer} />
      <InputsList
        data={inputData}
        state={state}
        setInputs={setState}
        ListHeaderComponent={() => <Text style={themedStyles.title}>{title}</Text>}
        SubmitButton={(props) => <SubmitButton {...props} title={buttonTitle} />}
        onSubmit={onSubmit}
        style={themedStyles.container}
        contentContainerStyle={themedStyles.contentContainer}
        scrollEnabled={false}
      />
      <View style={themedStyles.spacer} />
    </>
  )
};

export const inputModalProps = ({ title, inputData, buttonTitle }) => ({
  type: ModalTypes.INPUT_MODAL,
  animationType: ModalAnimationTypes.CENTER_SPRING_MODAL,
  props: { title, inputData, buttonTitle }
});

export default InputModal;

const styles = (Colors) => ({
  container: {
    width: Layout.window.width - 125,
    maxWidth: 500,
    backgroundColor: Colors.backgroundColor,
    padding: 30,
    borderRadius: 10
  },
  spacer: {
    flex: 100000000
  },
  contentContainer: {
    paddingHorizontal: 0
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.header,
    marginBottom: 20,
    textAlign: "center",
    color: Colors.primaryText
  }
});