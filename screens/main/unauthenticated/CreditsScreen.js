import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Layout from "../../../constants/Layout";
import createStyleSheet from "../../../constants/Colors";
import TopIconButton from "../../../components/TopIconButton";

const CreditsScreen = ({ navigation }) => {
  const themedStyles = createStyleSheet(styles);
  const inset = useSafeAreaInsets();

  return (
    <View style={[themedStyles.container, { paddingTop: inset.top, paddingBottom: inset.bottom }]}>
      <TopIconButton iconName={"arrow-back"} style={{ top: inset.top, left: 30}} onPress={() => navigation.pop()} />
      <Text style={themedStyles.title}>Credits</Text>
      <Text style={themedStyles.text}>Developed by Emily Sturman</Text>
      <Text style={themedStyles.text}>Maintained by Edwin Mui and Thijs Simonian</Text>
      <Text style={themedStyles.text}>Logo designed by Ronan Furuta</Text>
      <Text style={themedStyles.text}>
        Special thanks to Adnan Iftekhar, Kathleen Fazio, and the LWHS caf staff for making this possible!
      </Text>
      <Text style={[themedStyles.text, { marginBottom: 0 }]}>
        Questions or concerns? Email us at
      </Text>
      <TouchableOpacity
        style={themedStyles.linkTouchable}
        onPress={() => Linking.openURL("mailto:simplesubs-dev@lwhs.org")}
      >
        <Text style={themedStyles.linkTouchableText}>simplesubs-dev@lwhs.org</Text>
      </TouchableOpacity>
    </View>
  )
};

export default CreditsScreen;

const styles = (Colors) => ({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    alignItems: "center",
    marginBottom: 50,
    marginTop: 20
  },
  title: {
    fontFamily: "josefin-sans-bold",
    fontSize: Layout.fonts.mainTitle,
    margin: 20,
    textAlign: "center",
    color: Colors.primaryText
  },
  text: {
    fontFamily: "josefin-sans",
    color: Colors.primaryText,
    fontSize: Layout.fonts.body,
    marginVertical: 10,
    textAlign: "center",
    marginHorizontal: 30,
    lineHeight: 25
  },
  linkTouchable: {
    marginBottom: 20,
    width: "100%"
  },
  linkTouchableText: {
    color: Colors.linkText,
    fontSize: Layout.fonts.body,
    fontFamily: "josefin-sans",
    textAlign: "center",
    marginVertical: 0
  }
});