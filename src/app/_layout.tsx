import "../global.css";
import { Stack } from "expo-router";
// App.tsx
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <Stack screenOptions={{ headerShown: false }} />
    </I18nextProvider>
  );
}
