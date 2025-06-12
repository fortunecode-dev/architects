import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Clientes",
            title: "Clientes",
          }}
        />
        <Drawer.Screen
          name="client" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "New Client",
            title: "Client",
          }}
        />
        <Drawer.Screen
          name="question" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: "Responder Pregunta",
            title: "Responder Pregunta",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
