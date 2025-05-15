import { useRef } from "react";
import { Text, View, Alert, ScrollView, TouchableOpacity, Image, TextInput, KeyboardTypeOptions} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { Linking } from "react-native";
export default function Page() {
  const scrollRef = useRef<ScrollView>(null);
  const sections = ["landing", "services", "contact"];

  const scrollToSection = (index: number) => {
    scrollRef.current?.scrollTo({
      y: index * 1000, // Ajusta según la altura de tus secciones
      animated: true,
    });
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      <Header scrollToSection={scrollToSection} sections={sections} />

      <ScrollView
        ref={scrollRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <LandingSection />
        <ServicesSection />
        <ContactSection />
      </ScrollView>

      <Footer />
    </View>
  );
}

// Componentes actualizados
function Header({
  scrollToSection,
  sections,
}: {
  scrollToSection: (index: number) => void;
  sections: string[];
}) {
  const { top } = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View
      style={{ paddingTop: top }}
      className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 border-b"
    >
      <View className="flex flex-row justify-between items-center px-6 h-16">
        {/* Logo al estilo Vite/Next */}
        <View className="flex-row items-center">
          <Image
            source={{
              uri: "https://placehold.co/40x40/2563eb/white?text=ACME",
            }}
            className="mr-2 rounded-lg w-10 h-10"
          />
          <Text className="font-bold text-gray-900 dark:text-white text-xl">
            ACME
          </Text>
        </View>

        {/* Navegación al estilo GitHub */}
        <View className="hidden md:flex flex-row gap-6 ml-20">
          {sections.map((section, index) => (
            <TouchableOpacity
              key={section}
              onPress={() => scrollToSection(index)}
              className="py-2"
            >
              <Text className="font-medium text-gray-600 hover:text-gray-900 dark:hover:text-white dark:text-gray-300 text-sm capitalize">
                {section}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botones Contactar e Iniciar sesión SOLO en escritorio */}
        <View className="hidden md:flex flex-row gap-3">
          <TouchableOpacity className="px-4 py-2 rounded-md">
            <Text className="font-medium text-gray-600 dark:text-gray-300 text-sm">
              Contactar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-md">
            <Text className="font-medium text-white text-sm">
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botón de menú hamburguesa SOLO en móvil */}
        <View className="md:hidden">
          <TouchableOpacity
            onPress={() => setMenuOpen(!menuOpen)}
            className="p-2"
            accessibilityLabel="Abrir menú de navegación"
          >
            <View className="relative justify-center w-6 h-6">
              {/* Línea superior */}
              <View
                className={`
                  absolute w-6 h-1 rounded bg-gray-800 dark:bg-white transition-all duration-300
                  ${menuOpen ? "rotate-45 top-2.5" : "top-0"}
                `}
              />
              
              <View
                className={`
                  absolute w-6 h-1 rounded bg-gray-800 dark:bg-white transition-all duration-300
                  ${menuOpen ? "opacity-0" : "top-2.5"}
                `}
              />
              {/* Línea inferior */}
              <View
                className={`
                  absolute w-6 h-1 rounded bg-gray-800 dark:bg-white transition-all duration-300
                  ${menuOpen ? "-rotate-45 top-2.5" : "top-5"}
                `}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* Menú móvil */}
      {menuOpen && (
        <View className="md:hidden bg-white dark:bg-gray-950 px-6 py-4 border-gray-200 dark:border-gray-800 border-t">
          {sections.map((section, index) => (
            <TouchableOpacity
              key={section}
              onPress={() => {
                setMenuOpen(false);
                scrollToSection(index);
              }}
              className="py-2"
            >
              <Text className="py-5 font-medium text-gray-600 active:text-blue-600 dark:text-gray-300 text-base capitalize">
                {section}
              </Text>
            </TouchableOpacity>
          ))}

          <hr className="md:hidden block my-5 border-blue-300 border-dashed rounded-full h-1" />

          {/* Botones Contactar e Iniciar sesión SOLO en móvil */}
          <View className="flex flex-row gap-3">
            <TouchableOpacity className="px-4 py-2 rounded-md">
              <Text className="font-medium text-gray-600 dark:text-gray-300 text-sm">
                Contactar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-md">
              <Text className="font-medium text-white text-sm">
                Iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View >
  );
}
 
function LandingSection() {
  return (
    <View className="flex justify-center items-center bg-gradient-to-b from-blue-50 dark:from-gray-900 to-white dark:to-gray-950 px-6 w-full h-screen">
      <View className="mx-auto max-w-3xl">
        {/* Texto principal al estilo Vite */}
        <Text className="mb-6 font-bold text-gray-900 dark:text-white text-4xl md:text-6xl text-center">
          Transforma tu negocio con <Text className="text-blue-600">ACME</Text>
        </Text>

        {/* Descripción al estilo Next.js */}
        <Text className="mx-auto mb-10 max-w-2xl text-gray-600 dark:text-gray-300 text-lg md:text-xl text-center">
          La plataforma todo-en-uno que simplifica tus operaciones y aumenta tu
          productividad con herramientas inteligentes.
        </Text>

        {/* Botones al estilo Prisma/GitHub */}
        <View className="flex sm:flex-row flex-col justify-center gap-4">
          <TouchableOpacity className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md">
            <Text className="font-medium text-white text-base text-center">
              Comenzar ahora
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md">
            <Text className="font-medium text-gray-700 dark:text-gray-300 text-base text-center">
              Ver demo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text className="px-6 py-3 font-medium text-blue-600 dark:text-blue-400 text-base text-center">
              Más información →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function ServicesSection() {
  const services = [
    {
      title: "Automatización",
      description: "Automatiza tus procesos repetitivos y ahorra tiempo.",
      icon: "⚡",
    },
    {
      title: "Analítica",
      description: "Toma decisiones basadas en datos en tiempo real.",
      icon: "📊",
    },
    {
      title: "Integraciones",
      description: "Conecta todas tus herramientas favoritas.",
      icon: "🔌",
    },
  ];

  return (
    <View className="flex justify-center items-center bg-white dark:bg-gray-950 px-6 w-full h-screen">
      <View className="mx-auto max-w-6xl">
        <Text className="mb-12 font-bold text-gray-900 dark:text-white text-3xl md:text-4xl text-center">
          Nuestros Servicios
        </Text>

        <View className="gap-8 grid grid-cols-1 md:grid-cols-3">
          {services.map((service, index) => (
            <View
              key={index}
              className="bg-gray-50 dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 hover:border-blue-500 rounded-xl transition-all"
            >
              <Text className="mb-4 text-3xl">{service.icon}</Text>
              <Text className="mb-2 font-semibold text-gray-900 dark:text-white text-xl">
                {service.title}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400">
                {service.description}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Nuevo estado para el número de teléfono
  const [address, setAddress] = useState(""); // Nuevo estado para la dirección
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ name: false, email: false });

  const handleSubmit = () => {
    const newErrors = {
      name: !name.trim(),
      email: !email.trim(),
    };
    setErrors(newErrors);

    if (newErrors.name || newErrors.email) {
      Alert.alert(
        "Error",
        "Por favor, completa todos los campos obligatorios y selecciona al menos una preferencia."
      );
      return;
    }

    const to = "osmel.rubido@gmail.com";
    const subject = encodeURIComponent("Formulario de Contacto");
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || "No proporcionado"}\nDirección: ${address || "No proporcionada"}\nMensaje: ${message}`
    );

    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;
    Linking.openURL(mailtoUrl)
      .then(() => {
        Alert.alert("Éxito", "El correo se ha preparado correctamente.");
      })
      .catch((err) => {
        Alert.alert("Error", "No se pudo abrir el cliente de correo.");
        console.error(err);
      });
  };

  return (
    <View className="flex justify-center items-center bg-gray-50 dark:bg-gray-300 py-10">
      <View className="flex lg:flex-row flex-col gap-5 bg-zinc-200 drop-shadow-xl rounded-xl w-2/3">
        {/* Sección de información */}
        <View className="bg-gradient-to-t from-indigo-500 to-indigo-600 drop-shadow-md p-16 rounded-xl w-full lg:w-1/2">
          <Text className="mb-6 font-bold text-gray-900 dark:text-white text-3xl md:text-4xl">
            Contact Information
          </Text>
          <Text className="mb-10 text-gray-600 dark:text-gray-300 text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi inventore quo cupiditate sed ex quis est ab repudiandae aliquam recusandae.
          </Text>
          
          <TouchableOpacity onPress={() => Linking.openURL("tel:4706011911")}>
            <Text className="flex items-center gap-5 mt-28 font-semibold text-gray-200 text-2xl">
              <Image
                source={require("../../assets/circle-phone-flip.png")}
                className="max-w-8 max-h-8"
              />
              470-601-1911
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("sms:4706011911")}>
            <Text className="flex items-center gap-5 pt-5 font-semibold text-gray-200 text-2xl">
              <Image
                source={require("../../assets/puntos-de-comentario.png")}
                className="max-w-8 max-h-8"
              />
              Direct Message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://wa.me/1234567890")}>
            <Text className="flex items-center gap-5 pt-5 font-semibold text-gray-200 text-2xl">
              <Image
                source={require("../../assets/whatsapp (2).png")}
                className="max-w-8 max-h-8"
              />
              WhatsApp
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("mailto:osmel.rubido@gmail.com")}>
            <Text className="flex items-center gap-5 pt-5 font-semibold text-gray-200 text-2xl">
              <Image
                source={require("../../assets/sobre.png")}
                className="max-w-8 max-h-8"
              />
              Email
            </Text>
          </TouchableOpacity>
          {/* <View className="flex flex-row mt-20">
            <TouchableOpacity onPress={() => Linking.openURL("https://facebook.com")}>
              <Image
                className="max-w-8 max-h-8"
                source={require("../../assets/facebook.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL("https://instagram.com")}>
              <Image
                className="mx-3 max-w-8 max-h-8"
                source={require("../../assets/instagram.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL("https://linkedin.com")}>
              <Image
                className="mx-3 max-w-8 max-h-8"
                source={require("../../assets/linkedin.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL("https://youtube.com")}>
              <Image
                className="mx-3 max-w-8 max-h-8"
                source={require("../../assets/youtube.png")}
              />
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Sección del formulario */}
        <View className="flex-1 space-y-4 m-4 pt-8 min-w-0">
          <InputField
            label="Nombre"
            value={name}
            onChangeText={setName}
            placeholder="Nombre"
            error={errors.name}
          />
          <View className="relative flex flex-row w-full">
            <View className="w-1/2">
              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                error={errors.email}
              />
            </View>
            <View className="right-0 absolute w-2/5">
              {/* Campo para el número de teléfono */}
              <InputField
                label={"Teléfono"}
                value={phone}
                onChangeText={setPhone}
                placeholder="Teléfono"
                keyboardType="phone-pad"
              />
            </View>
          </View>
          {/* Campo para la dirección */}
          <InputField
            label="Dirección"
            value={address}
            onChangeText={setAddress}
            placeholder="Dirección"
          />
          <TextAreaField
            label="Mensaje"
            value={message}
            onChangeText={setMessage}
            placeholder="Mensaje"
          />
          <SubmitButton onPress={handleSubmit} label="Enviar mensaje" />
        </View>
      </View>
    </View>
  );
}
function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions; 
  error?: boolean; 
}) {
  return (
    <View>
      <Text className="mb-1 font-medium text-gray-700 dark:text-gray-900 text-xl">
        {label} {error && <Text className="text-red-500">*</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType} // Ahora es del tipo correcto
        className={`bg-white dark:bg-gray-800 px-3 border ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-900"
        } rounded-md h-10 dark:text-gray-100`}
      />
    </View>
  );
}

function TextAreaField({ label, value, onChangeText, placeholder }) {
  return (
    <View>
      <Text className="mt-4 mb-1 font-medium text-gray-700 dark:text-gray-900 text-xl">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={true}
        numberOfLines={5}
        className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-700 rounded-md h-32 dark:text-gray-300"
        textAlignVertical="top"
      />
    </View>
  );
}

function SubmitButton({ onPress, label }) {
  return (
    <TouchableOpacity onPress={onPress} className="bg-gradient-to-t from-indigo-500 to-indigo-600 mt-4 px-6 py-3 rounded-md">
      <Text className="font-medium text-white text-base text-center">{label}</Text>
    </TouchableOpacity>
  );
}

function Footer() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 border-t"
      style={{ paddingBottom: bottom }}
    >
      <View className="mx-auto px-6 py-8 w-full max-w-6xl">
        <View className="flex md:flex-row flex-col justify-between items-center w-full">
          {/* Logo y copyright */}
          <View className="flex items-center md:items-start mb-6 md:mb-0">
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: "https://placehold.co/40x40/2563eb/white?text=ACME",
                }}
                className="mr-2 rounded-lg w-8 h-8"
              />
              <Text className="font-bold text-gray-900 dark:text-white text-lg">
                ACME
              </Text>
            </View>
            <Text className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} ACME Inc. Todos los derechos
              reservados.
            </Text>
          </View>

          {/* Links rápidos */}
          <View className="gap-8 grid grid-cols-2">
            <View className="space-y-2">
              <Text className="font-semibold text-gray-900 dark:text-white text-sm">
                Producto
              </Text>
              <View className="space-y-1">
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Características
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Precios
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Documentación
                </Text>
              </View>
            </View>

            <View className="space-y-2">
              <Text className="font-semibold text-gray-900 dark:text-white text-sm">
                Compañía
              </Text>
              <View className="space-y-1">
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Nosotros
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Blog
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  Carreras
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
