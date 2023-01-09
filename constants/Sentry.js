import Layout from "./Layout";
import * as Sentry from "sentry-expo";

const reportToSentry = (error) => {
  if (Layout.web) {
    Sentry.Browser.captureException(error);
  } else {
    Sentry.Native.captureException(error);
  }
};

export default reportToSentry;