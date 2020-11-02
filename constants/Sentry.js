/**
 * @file Manages Sentry actions (error reporting service).
 * @author Emily Sturman <emily@sturman.org>
 */
import Layout from "./Layout";
import * as Sentry from "sentry-expo";

/**
 * Reports given error to Sentry error reporting.
 *
 * Sends order using Sentry.Browser if on web, otherwise
 * uses Sentry.Native.
 *
 * WARNING: MAY BREAK
 *
 * @param {Error} error Error object to report.
 */
const reportToSentry = (error) => {
  if (Layout.web) {
    Sentry.Browser.captureException(error);
  } else {
    Sentry.Native.captureException(error);
  }
};

export default reportToSentry;