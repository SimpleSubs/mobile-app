import React from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { KeyboardAwareSectionList } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AnimatedTouchable from "../AnimatedTouchable";
import OrderField from "./OrderField";
import createStyleSheet, { getColors } from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { useSelector } from "react-redux";
import alert from "../../constants/Alert";
import { getUserLunchSchedule, isDynamic } from "../../constants/Schedule";
import {
  getDefault,
  validateOrderState,
  isUniqueTitle,
  resetOptionValues,
  getAllOrderOptions,
  getDisplayOrderFields
} from "../../constants/OrdersAndOptions";

const CancelDoneButtons = ({ cancelOnPress, doneOnPress }) => {
  const themedStyles = createStyleSheet(styles);
  return (
    <View style={themedStyles.cancelDoneButtonsContainer}>
      <TouchableOpacity
        style={Layout.isSmallDevice ? themedStyles.cancelButtonMobile : themedStyles.cancelButton}
        onPress={cancelOnPress}
      >
        {Layout.isSmallDevice ?
          <Ionicons name={"close"} color={getColors().primaryText} size={50}/> :
          <Text style={themedStyles.cancelButtonText}>Cancel</Text>}
      </TouchableOpacity>
      <AnimatedTouchable
        style={Layout.isSmallDevice ? themedStyles.doneButtonMobile : themedStyles.doneButton}
        endSize={0.9}
        onPress={doneOnPress}
      >
        {Layout.isSmallDevice ?
          <Ionicons name={"checkbox"} color={getColors().accentColor} size={50}/> :
          <Text style={themedStyles.doneButtonText}>Done</Text>}
      </AnimatedTouchable>
    </View>
  )
};

const DeleteButton = ({ onPress, message }) => {
  const themedStyles = createStyleSheet(styles);
  return (
    <TouchableOpacity style={themedStyles.deleteButton} onPress={onPress}>
      <Text style={themedStyles.deleteButtonText}>{message}</Text>
    </TouchableOpacity>
  )
};

/**
 * Displays order-type fields
 */
const OrderInputsList = ({ title, focusedData, orderOptions, cancel, createNew, editExisting, deleteExisting, deleteMessage }) => {
  const orderPresets = useSelector(({ orderPresets }) => orderPresets);
  const orders = useSelector(({ orders }) => orders);
  const lunchSchedule = useSelector(({ stateConstants, user }) => (
    getUserLunchSchedule(stateConstants.lunchSchedule, user)
  ));
  const orderSchedule = useSelector(({ stateConstants }) => stateConstants.orderSchedule);

  const [dynamicOptions, setDynamicOptions] = React.useState([]);
  const [state, setFullState] = React.useState(getDefault(focusedData, dynamicOptions));
  const [displayOptions, setDisplayOptions] = React.useState([]);

  const themedStyles = createStyleSheet(styles);
  const inset = useSafeAreaInsets();

  const submit = () => {
    // Ensure all required fields are filled out
    const hasDynamicSchedule = isDynamic(orderSchedule);
    const invalidInputs = validateOrderState(state, dynamicOptions, hasDynamicSchedule);
    if (invalidInputs.length > 0) {
      alert(
        "Fill out required fields",
        "The following fields need to be filled out before submission: " + invalidInputs.join(", ")
      );
      return;
    }
    // TODO: Ensure order isn't placed after cutoff time
    // TODO: Add compatibility with order presets
    // Ensure title of preset isn't already taken
    if (state.title && !isUniqueTitle(state.title, focusedData?.title, orderPresets)) {
      return;
    }
    let newState;
    if (state.preset) {
      // Fills state with preset fields
      let presetKey = Object.keys(orderPresets).filter((id) => orderPresets[id].title === state.preset);
      newState = {...orderPresets[presetKey], date: state.date};
    } else {
      // Filter out possible "empty" order dates (such as if a date did not have any possible options)
      let stateKeysWithContent = Object.keys(state).filter((key) => Object.keys(state[key]).length > 0);
      if (hasDynamicSchedule) {
        stateKeysWithContent = stateKeysWithContent.filter((key) => key !== "date");
      }
      let stateWithContent = {}
      stateKeysWithContent.forEach((key) => stateWithContent[key] = state[key]);
      newState = resetOptionValues(stateWithContent, dynamicOptions);
    }
    // Pushes to existing doc if editing, otherwise creates new doc
    if (Object.keys(newState).length > 0) {
      if (focusedData) {
        editExisting(newState, focusedData.keys || [focusedData.key]);
      } else {
        createNew(newState);
      }
    }
    cancel();
  };

  const deleteAndNavigate = () => {
    if (focusedData) {
      deleteExisting(focusedData.keys || focusedData.key);
    }
    cancel();
  }

  const setState = (newState, sectionKey) => {
    if (sectionKey) {
      setFullState({
        ...state,
        [sectionKey]: {
          ...(state[sectionKey] || {}),
          ...newState
        }
      });
    } else {
      setFullState({ ...state, ...newState });
    }
  };

  React.useEffect(() => {
    const newOptions = getAllOrderOptions(
      orderOptions,
      orderSchedule,
      orders,
      focusedData,
      orderPresets,
      lunchSchedule,
      state
    );
    const newDisplayOptions = getDisplayOrderFields(
      newOptions,
      orderSchedule,
      focusedData,
      state,
      setFullState
    );
    setDynamicOptions(newOptions);
    setDisplayOptions(newDisplayOptions);
  }, [orderSchedule, orders, focusedData, orderPresets, state.date]);

  // May need to reinsert insets for Android (depends on how modal renders)
  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.headerText}>{title}</Text>
        <CancelDoneButtons cancelOnPress={cancel} doneOnPress={submit} />
      </View>
      <KeyboardAwareSectionList
        keyboardOpeningTime={0}
        extraScrollHeight={50}
        alwaysBounceVertical={false}
        keyboardDismissMode={Layout.ios ? "interactive" : "on-drag"}
        contentContainerStyle={{ paddingBottom: inset.bottom + 100 }}
        ListFooterComponent={focusedData && (
          <DeleteButton onPress={deleteAndNavigate} message={deleteMessage} />
        )}
        sections={displayOptions}
        renderItem={({ item, section }) => (
          <OrderField
            {...item}
            options={item.options && item.dynamicDay ? item.options[section.dateIndex] : item.options}
            focusedOrder={focusedData}
            value={section.isNested ? state[section.key][item.key] : state[item.key]}
            setValue={(value) => {
              if (section.isNested) {
                setState({ [item.key]: value }, section.key);
              } else {
                setState({ [item.key]: value });
              }
            }}
          />
        )}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          section.isNested && section.data.length > 0 ?
            <Text style={themedStyles.sectionHeader}>{section.title}</Text> :
            null
        )}
      />
    </View>
  )
};

export default OrderInputsList;

const styles = (Colors) => ({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1
  },
  header: {
    padding: 20,
    backgroundColor: Colors.backgroundColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    zIndex: 100,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  headerText: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.header,
    textAlign: "left",
    color: Colors.primaryText
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelButtonMobile: {
    alignItems: "center",
    justifyContent: "center"
  },
  cancelButtonText: {
    fontFamily: "josefin-sans",
    fontSize: Layout.fonts.title,
    textAlign: "center",
    color: Colors.secondaryText
  },
  doneButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: Colors.accentColor
  },
  doneButtonMobile: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  doneButtonText: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    textAlign: "center",
    color: Colors.textOnBackground
  },
  cancelDoneButtonsContainer: {
    flexDirection: "row"
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.errorText,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.title,
    color: Colors.textOnBackground
  },
  sectionHeader: {
    fontSize: Layout.fonts.title,
    fontFamily: "josefin-sans-bold",
    color: Colors.primaryText,
    flex: 1,
    padding: 20,
    paddingBottom: 10
  }
});