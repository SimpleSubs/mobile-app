import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import Header from "../../components/Header";
import PresetCard from "../../components/PresetCard";

import { connect } from "react-redux";
import { watchPresets, deletePreset, focusPreset } from "../../redux/Actions";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";

const OrderSettingsScreen = ({ orderPresets, uid, watchPresets, deletePreset, focusPreset, navigation }) => {
  const focusPresetNavigate = (id) => {
    focusPreset(id);
    navigation.navigate("Preset");
  }

  useEffect(() => watchPresets(uid), []);

  return (
    <View style={styles.container}>
      <Header
        title={"Order Presets"}
        leftButton={{ name: "ios-arrow-back", onPress: () => navigation.pop() }}
        rightButton={{ name: "md-add", onPress: () => navigation.navigate("Preset") }}
      />
      <FlatList
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            You haven't created any presets yet. Click the '+' button in the upper right corner to create one.
          </Text>
        )}
        data={orderPresets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <PresetCard
            title={item.title}
            onPress={() => focusPresetNavigate(item.key)}
            onDelete={() => deletePreset(item.key, uid)}
            {...item}
          />
        )}
        contentContainerStyle={{ paddingBottom: useSafeArea().bottom }}
        style={styles.flatList}
      />
    </View>
  )
};

const mapStateToProps = ({ user, orderPresets }) => ({
  uid: user.uid,
  orderPresets: Object.values(orderPresets)
});

const mapDispatchToProps = (dispatch) => ({
  watchPresets: (uid) => watchPresets(dispatch, uid),
  deletePreset: (id, uid) => deletePreset(dispatch, id, uid),
  focusPreset: (id) => dispatch(focusPreset(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderSettingsScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.scrollViewBackground,
    flex: 1
  },
  updateButton: {
    marginHorizontal: 20
  },
  emptyText: {
    color: Colors.primaryText,
    fontSize: Layout.fonts.body,
    textAlign: "center",
    fontFamily: "josefin-sans",
    margin: 40
  }
});