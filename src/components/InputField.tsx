import { COLORS } from "@/app/colors";
import { Text, View, TextInput, TextInputProps } from "react-native";
import { useTranslation } from "react-i18next";
export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  error = false,
  required = false,
  onFocus = () => {},
  onBlur = () => {},
  editable = true,
  autoCapitalize = "sentences",
  autoComplete,
}: InputFieldProps) {
  const { t } = useTranslation();
  return (
    <View className="mb-1 lg:mb-3">
      <Text
        className="mb-1 font-medium text-sm lg:text-xl"
        style={{ color: COLORS.blueDark, flexDirection: "row", alignItems: "center" }}
      >
        {label}
        {required && !value && (
          <Text style={{ color: "#ff0000" }}> *</Text>
        )}
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
          {t("common.requiredField")}
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
  required?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  editable?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoComplete?: TextInputProps["autoComplete"];
};