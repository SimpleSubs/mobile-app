import React from "react";
import {
  View,
  Text,
  FlatList
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import PresetCard from "../../../components/orders/PresetCard";
import { useSelector, useDispatch } from "react-redux";
import { focusPreset } from "../../../redux/features/orders/focusedPresetSlice";
import { watchPresets, deletePreset } from "../../../redux/Thunks";
import createStyleSheet from "../../../constants/Colors";
import Layout from "../../../constants/Layout";

const OrderSettingsScreen = ({ navigation }) => {
  const orderPresets = useSelector(({ orderPresets }) => Object.values(orderPresets));
  const dispatch = useDispatch();
  const themedStyles = createStyleSheet(styles);
  
  // Focuses an existing order preset and navigates to preset screen.
  const focusPresetNavigate = (id) => {
    dispatch(focusPreset(id));
    navigation.navigate("Preset");
  }

  // Creates listener for user's presets.
  React.useEffect(watchPresets, []);

  return (
    <View style={themedStyles.container}>
      <Header
        title={"Order Presets"}
        leftButton={{ name: "arrow-back", onPress: () => navigation.pop() }}
        rightButton={{ name: "add", onPress: () => navigation.navigate("Preset") }}
      />
      <FlatList
        ListEmptyComponent={() => (
          <Text style={themedStyles.emptyText}>
            You haven't created any presets yet. Click the '+' button in the upper right corner to create one.
          </Text>
        )}
        data={orderPresets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <PresetCard
            title={item.title}
            onPress={() => focusPresetNavigate(item.key)}
            onDelete={() => dispatch(deletePreset(item.key))}
            {...item}
          />
        )}
        contentContainerStyle={{ paddingBottom: useSafeAreaInsets().bottom }}
        style={themedStyles.flatList}
      />
    </View>
  )
};

export default OrderSettingsScreen;

const styles = (Colors) => ({
  container: {
    backgroundColor: Colors.scrollViewBackground,
    flex: 1
  },
  emptyText: {
    color: Colors.primaryText,
    fontSize: Layout.fonts.body,
    textAlign: "center",
    fontFamily: "josefin-sans",
    margin: 40
  }
});