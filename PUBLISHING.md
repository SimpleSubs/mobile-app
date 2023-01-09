Publishing the App
==================

Creating binaries
-----------------

The first step in publishing the app is creating the app binaries. These are the files that you will be uploading to
the App and Play Store. The Github Action should take care of this automatically when you merge a pull request into
master; however, instructions on how to do this manually are provided below:

### Step 1: Configure your build (first time building)

As of writing, the latest version of eas-cli is 3.1.1. To install, run the following command:

```shell
npm install -g eas-cli
```

You will then want to log in &mdash; run the following command and use your Expo credentials:

```shell
eas login
```

Verify your authentication using `eas-whoami`.

Next, configure your build by running

```shell
eas build:configure
```

Generally, the default selections should suffice.

### Step 2: Create `.env` file

A `.env` file is necessary to store the Sentry auth token. It should resemble the following format:

```text
SENTRY_AUTH_TOKEN=<auth token here>
```

The file should be automatically included in `.gitignore`, but **please ensure that it does not get added or committed
to git**. If it does, you will need to delete the exposed token and create a new one.

Once you have created your `.env` file, you can add it to EAS with the following command:

```shell
eas secret:push --scope project --env-file .env
```

### Step 3: Update version numbers in `app.json`

Updating version numbers in `app.json` is not only a useful way to keep track of builds, but it is also required in
order to send a build to the App or Play Store, as the version number is used to differentiate the builds. In `app.json`,
you will need to increment the `expo.ios.buildNumber` field (to identify your iOS build), the `expo.android.versionCode`
field (to identify your Android build) and the `expo.version` field (technically optional, but good to keep up to date).

Note that `expo.ios.buildNumber` must be unique in relation to `expo.version`. That is, if you submit multiple builds
for version 5.0.0 (say, to fix bugs found during beta testing), you must increment the build number accordingly. However,
upon creating a new app version (such as 5.0.1), you can reset the build number to 1.

For `expo.version`, use your own discretion on how to increment &mdash; generally, increment by 1.0.0 for large updates
with significant changes and added features, 0.1.0 for small improvements and additions, and 0.0.1 for bug fixes. This is
mostly for developer and user reference, so there are no strict rules on the version itself.

### Step 4: Create your build

To generate builds for both platforms, run the following command:

```shell
eas build --platform all
```

You can also adjust the above to `--platform ios` or `--platform android` if necessary. You may be prompted for your iOS
account credentials. Eventually, you should see a link to both your iOS and Android builds. At this point, you can
safely exit the terminal without cancelling the builds, and the links will allow you to check the status of each build.

### Step 5: Create webapp build

Building for the webapp requires a different command than building for iOS and Android. To create a web build, run the
following:

```shell
SENTRY_AUTH_TOKEN=<auth token here> npx expo export:web
```

This will build the app to `web-build/` in your local directory. If you would like to locally serve the webapp to
verify the build, you can run

```shell
npx serve web-build
```

You may be prompted to install the `serve` package. Once you have verified your build, you can move on to deploying
in the next step.

The above instructions and more can also be found [here](https://docs.expo.dev/build/setup/) and
[here](https://docs.expo.dev/distribution/publishing-websites/) in the Expo documentation.

Deploying the app
-----------------

### Deploy on Web

Deploying on web is the most straightforward out of the three platforms, as it requires no review time and can be
rolled back or updated as many times as necessary. Firstly, install the latest version of the Firebase CLI with the
following command:

```shell
npm install -g firebase-tools
```

If this is your first time installing Firebase CLI, you may need to log in. Run `firebase login` and authenticate with the
Google credentials tied to this Firebase project.

To deploy, simply run

```shell
firebase deploy --only hosting
```

And that's it! Your changes should be viewable on `app.simple-subs.com`.

### Deploy on iOS

Once you have created a binary using EAS, submit it to the App Store by running the command:

```shell
eas submit --platform ios
```

After providing the email associated with your Apple Developer account, select the option to "Select a build from EAS".
Select the build you just created, generate an App Store API key (if necessary), and wait for the submission to
complete.

Next, visit [App Store Connect](https://appstoreconnect.apple.com) and log in with your Apple Developer credentials.
Select "My Apps", then "SimpleSubs", then the plus icon at the top of the sidebar to create a new version. For
promotional text, feel free to copy from previous versions ("School lunches made easy &mdash; now supports dynamic schedules and
menus!") or write your own description. Additionally, update the "What's new in this version" field to include and updates,
improvements, and bug fixes (follow the format of previous versions).

Next, scroll down to "Build" and select the "Add Build" button. There may be a "Missing compliance" warning on the build
&mdash; to fix this, select "Manage" under the "Status" column, then select the option that reads:

> Standard encryption algorithms instead of, or in addition to, using or accessing the encryption within Apple's
> operating system

Respond "No" to the following question (re: deploying the app in France).

Update other fields as you deem necessary (you may want to update the app Contact Information), then select "Save"
in the top right. Once you are ready to deploy the app, you can select "Add for Review". Before doing this, you may
want to beta test the app using TestFlight. The app should be reviewed (and approved) within about 24 hours.

#### A note on app reviews

99% of the time, the app will be approved (provided that there are no glaring issues with it). However, if the app
is rejected repeatedly, you should [file an appeal](https://developer.apple.com/contact/app-store/?topic=appeal).

### Deploy on Android

To submit your binary using EAS, you will need a Google Service Account key. Follow
[these instructions](https://github.com/expo/fyi/blob/main/creating-google-service-account.md) to create a service account
(if necessary) and download a new key. Once you have downloaded the key, rename it as `serviceAccountKey.json` and store
it in this repo's working directory. Using this exact name is important, as it will not be added to git and will be
correctly configured with `eas.json`.

Once you have done this, submit your binary to the Play Store by running the command:

```shell
eas submit --platform android
```

Next, log into the [Google Play Console](https://play.google.com/console/) and select SimpleSubs from the apps list.
The app status should read "Ready for review". After selecting the app, go to the Publishing Overview page, then select
the "Send in for review" button. This will submit your app for review to be beta tested. If you want to publish it in
production, select the "Production" tab, then "Edit release" in the top right and fill out all required fields. Click
through to review your app and roll out to production.