import Constants from "expo-constants";

export const APP_NAME = Constants.expoConfig?.name;
export const APP_DESCRIPTION = Constants.expoConfig?.description;
export const APP_VERSION = Constants.expoConfig?.version;
export const APP_BUILD_VERSION =
  Constants.expoConfig?.ios?.buildNumber ||
  Constants.expoConfig?.android?.versionCode ||
  "1";
export const APP_ICON = require("@/assets/images/icon.png");

export const FAVORITES_STORAGE_KEY = "FAVORITES";
