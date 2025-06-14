import { Text, TouchableOpacity } from "react-native";
import { COLORS } from "@/app/colors";

export function SubmitButton({
  onPress,
  label,
  disabled = false,
}: {
  onPress: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className="px-6 py-2 lg:py-3 rounded-md"
      style={{
        backgroundColor: disabled ? COLORS.blueDarker : COLORS.blueDark,
        backgroundImage:
          "linear-gradient(150deg, rgb(49, 80, 114) 0%, rgb(108 155 201) 100%)",
        marginTop: 15,
      }}
    >
      <Text
        className="font-medium text-base text-center"
        style={{ color: COLORS.whiteSoft }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
