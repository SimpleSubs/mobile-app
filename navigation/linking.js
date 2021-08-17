import * as Linking from "expo-linking";

const linking = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    Root: {
      path: "root",
      screens: {
        Home: "home",
        Links: "links",
        Settings: "settings",
      },
    },
  },
};

export default linking;