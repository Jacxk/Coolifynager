import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onPress?: () => void;
};

export default function Button({ children, disabled, onPress }: ButtonProps) {
  return (
    <View style={[styles.buttonContainer, disabled && styles.buttonDisabled]}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={styles.buttonLabel}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    borderRadius: 10,
    backgroundColor: "#5f5f5f",
  },
  button: {
    width: "100%",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonLabel: {
    fontSize: 16,
    color: "white",
  },
  buttonDisabled: {
    backgroundColor: "#3f5f3f",
  },
});
