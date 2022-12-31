import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../../components/Header";
import PresetCard from "../../../components/orders/PresetCard";
import { connect } from "react-redux";
import { watchPresets, deletePreset, focusPreset } from "../../../redux/Actions";
import createStyleSheet from "../../../constants/Colors";
import Layout from "../../../constants/Layout";

const OrderSettingsScreen = ({ orderPresets, uid, domain, watchPresets, deletePreset, focusPreset, navigation }) => {
  const themedStyles = createStyleSheet(styles);
  
  // Focuses an existing order preset and navigates to preset screen.
  const focusPresetNavigate = (id) => {
    focusPreset(id);
    navigation.navigate("Preset");
  }

  // Creates listener for user's presets.
  useEffect(() => watchPresets(uid, domain), []);

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
            onDelete={() => deletePreset(item.key, uid, domain)}
            {...item}
          />
        )}
        contentContainerStyle={{ paddingBottom: useSafeAreaInsets().bottom }}
        style={themedStyles.flatList}
      />
    </View>
  )
};

const mapStateToProps = ({ user, orderPresets, domain }) => ({
  uid: user.uid,
  orderPresets: Object.values(orderPresets),
  domain: domain.id
});

const mapDispatchToProps = (dispatch) => ({
  watchPresets: (uid, domain) => watchPresets(dispatch, uid, domain),
  deletePreset: (id, uid, domain) => deletePreset(dispatch, id, uid, domain),
  focusPreset: (id) => dispatch(focusPreset(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderSettingsScreen);

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