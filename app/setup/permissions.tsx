import { Bell } from "@/components/icons/Bell";
import { Fingerprint } from "@/components/icons/Fingerprint";
import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/ui/typography";
import { useAppFocusEffect } from "@/hooks/useAppFocusEffect";
import useSetup from "@/hooks/useSetup";
import {
  getNotificationsPermission,
  registerForPushNotificationsAsync,
} from "@/lib/notifications";
import * as LocalAuthentication from "expo-local-authentication";
import { PermissionStatus as NotificationPermissionStatus } from "expo-notifications";
import { router } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PermissionStatus = "pending" | "granted" | "denied";

type PermissionButtonProps = {
  title: string;
  description: string;
  onPress: () => void;
  status: PermissionStatus;
  icon: React.ComponentType<any>;
};

function PermissionButton({
  title,
  description,
  onPress,
  status,
  icon: Icon,
}: PermissionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={status === "granted"}
      className={`flex-row items-center p-4 rounded-lg ${
        status === "granted"
          ? "bg-green-400/40"
          : status === "denied"
            ? "bg-red-400/40"
            : "bg-white/10"
      }`}
    >
      <View className="mr-3">
        <Icon className="w-6 h-6 text-white" />
      </View>
      <View className="flex-1 flex-col">
        <P className="text-white font-semibold">{title}</P>
        <P className="text-white/80 text-sm">{description}</P>
      </View>
    </TouchableOpacity>
  );
}

export default function SetupPermissions() {
  const { setPermissions, setSetupComplete } = useSetup();

  const [notificationsPermission, setNotificationsPermission] =
    useState<PermissionStatus>("pending");
  const [biometricsPermission, setBiometricsPermission] =
    useState<PermissionStatus>("pending");

  const insets = useSafeAreaInsets();
  const contentInsets = {
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: 12,
    paddingRight: 12,
  };

  const requestNotificationsPermission = async () => {
    if (notificationsPermission === "denied") {
      Linking.openSettings();
      return;
    }

    const result = await registerForPushNotificationsAsync();
    if (result.success) {
      setNotificationsPermission("granted");
    } else {
      setNotificationsPermission("denied");
    }
  };

  const requestBiometricsPermission = async () => {
    if (biometricsPermission === "denied") {
      Linking.openSettings();
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "This enables you to secure high risk actions.",
    });
    if (result.success) {
      setBiometricsPermission("granted");
    } else {
      setBiometricsPermission("denied");
    }
  };

  const handleFinish = () => {
    setPermissions(true)
      .then(() => setSetupComplete(true))
      .then(() => {
        router.dismissTo("/main");
      });
  };

  const checkPermissions = async () => {
    getNotificationsPermission()
      .then((result) => {
        switch (result.status) {
          case NotificationPermissionStatus.GRANTED:
            setNotificationsPermission("granted");
            break;
          case NotificationPermissionStatus.DENIED:
            setNotificationsPermission("denied");
            break;
          case NotificationPermissionStatus.UNDETERMINED:
            setNotificationsPermission("pending");
            break;
        }

        return Promise.resolve();
      })
      .then(() => {
        LocalAuthentication.isEnrolledAsync().then((isEnrolled) => {
          if (isEnrolled) {
            setBiometricsPermission("granted");
          } else {
            setBiometricsPermission("denied");
          }
        });
      });
  };

  useAppFocusEffect(() => {
    checkPermissions();
  });

  useLayoutEffect(() => {
    checkPermissions();
  }, []);

  return (
    <View className="flex-1 bg-branding" style={contentInsets}>
      <View className="flex-1 justify-center">
        <View className="gap-4">
          <View>
            <H1 className="text-center text-white">Before we get started</H1>
            <P className="text-center text-white/70 text-sm mb-6">
              We request you to grant the following permissions to get started.
              They are not required for the app to work.
            </P>
          </View>

          <View className="gap-4">
            <PermissionButton
              title="Notifications"
              description="Receive alerts about your applications and deployments"
              onPress={requestNotificationsPermission}
              status={notificationsPermission}
              icon={Bell}
            />

            <PermissionButton
              title="Biometric Authentication"
              description="Secure actions using fingerprint or face recognition"
              onPress={requestBiometricsPermission}
              status={biometricsPermission}
              icon={Fingerprint}
            />
          </View>
        </View>
      </View>

      <Button onPress={handleFinish} size="lg" className="w-full bg-white">
        <P className={`font-semibold text-black`}>Finish</P>
      </Button>
    </View>
  );
}
