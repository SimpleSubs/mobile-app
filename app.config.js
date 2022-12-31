module.exports = ({ config }) => {
  return {
    ...config,
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: "lwhs",
            project: "simple-subs",
            authToken: process.env.SENTRY_AUTH_TOKEN
          }
        }
      ]
    },
  }
};
