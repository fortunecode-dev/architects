import { COLORS } from "@/app/colors";
import { Text, View, TextInput, TextInputProps } from "react-native";

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  error = false,
  onFocus = () => {},
  onBlur = () => {},
  editable = true,
  autoCapitalize = "sentences",
  autoComplete,
}: InputFieldProps) {
  return (
    <View className="mb-1 lg:mb-3">
      <Text
        className="mb-1 font-medium text-sm lg:text-xl"
        style={{ color: COLORS.blueDark }}
      >
        {label}
        {error && <Text style={{ color: COLORS.error }}> *</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        keyboardType={keyboardType}
        onFocus={onFocus}
        onBlur={onBlur}
        editable={editable}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        className="px-3 rounded-md h-10"
        style={{
          backgroundColor: editable ? COLORS.white : COLORS.whiteSoft,
          borderColor: error
            ? COLORS.error
            : editable
            ? COLORS.accent
            : COLORS.gray,
          borderWidth: 1,
          color: COLORS.blueDark,
        }}
        selectionColor={COLORS.accent}
      />
      {error && (
        <Text style={{ color: COLORS.error, fontSize: 12 }}>
          This field is required
        </Text>
      )}
    </View>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: TextInputProps["keyboardType"];
  error?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  editable?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoComplete?: TextInputProps["autoComplete"];
};
