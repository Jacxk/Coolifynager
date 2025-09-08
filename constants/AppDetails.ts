import * as Application from "expo-application";
import Constants from "expo-constants";

export const APP_NAME = Constants.expoConfig?.name;
export const APP_DESCRIPTION = Constants.expoConfig?.description;
export const APP_VERSION = Application.nativeApplicationVersion;
export const APP_BUILD_VERSION = Application.nativeBuildVersion;
export const APP_ICON = require("@/assets/images/icon.png");

export const FAVORITES_STORAGE_KEY = "FAVORITES";
