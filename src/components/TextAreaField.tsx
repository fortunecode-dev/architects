import { COLORS } from "@/app/colors";
import { TextInput, View } from "react-native";
import React from "react";
import { Text } from "react-native";

export function TextAreaField({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) {
  return (
    <View>
      <Text
        className="mt-4 mb-1 font-medium text-md lg:text-xl"
        style={{ color: COLORS.blueDark }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={true}
        numberOfLines={3}
        className="p-2 rounded-md"
        style={{
          backgroundColor: COLORS.white,
          borderColor: COLORS.accent,
          borderWidth: 1,
          color: COLORS.blueDark,
          minHeight: 96,
        }}
        textAlignVertical="top"
        placeholderTextColor={COLORS.gray}
      />
    </View>
  );
}
