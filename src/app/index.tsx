import { useRef, useEffect, useState } from "react";
import { SERVER_URL } from "@env";

import {
  Linking,
  Animated,
  ViewProps,
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  TextInputProps,
} from "react-native";
import { useFonts } from "expo-font";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WritingLogo from "@/components/WritingLogo";
import axios from "axios";

export default function Page() {
  const [fontsLoaded] = useFonts({
    "Tinos-Bold": require("../../assets/fonts/Tinos/Tinos-Bold.ttf"),
    "Tinos-Italic": require("../../assets/fonts/Tinos/Tinos-Italic.ttf"),
    "Tinos-Regular": require("../../assets/fonts/Tinos/Tinos-Regular.ttf"),
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = {
    landing: useRef<View>(null),
    services: useRef<View>(null),
    contact: useRef<View>(null),
  };

  const scrollToSection = (sectionName: string) => {
    sectionRefs[sectionName].current?.measureLayout(
      scrollViewRef.current?.getInnerViewNode(),
      (x, y) => {
        scrollViewRef.current?.scrollTo({ y, animated: true });
      },
      () => {}
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  const sections = ["landing", "services", "contact"];

  return (
    <View className="flex-1 bg-[#fdf6e3]">
      <Header sections={sections} scrollToSection={scrollToSection} />
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View ref={sectionRefs.landing}>
          <LandingSection />
        </View>
        <View ref={sectionRefs.services}>
          <ServicesSection />
        </View>
        <View ref={sectionRefs.contact}>
          <ContactSection />
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}

export function FadeInView({
  children,
  style,
  ...props
}: ViewProps & { children: React.ReactNode }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[{ opacity: fadeAnim }, style]} {...props}>
      {children}
    </Animated.View>
  );
}

function Header({
  sections,
  scrollToSection,
}: {
  sections: string[];
  scrollToSection: (section: string) => void;
}) {
  const { top } = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View
      style={{ paddingTop: top }}
      className="bg-[#fdf6e3] border-[#f0e6cc] border-b"
    >
      <View className="flex flex-row justify-between items-center px-6 pt-4 h-16">
        <View className="flex-row justify-center items-center">
          <Image
            source={require("../../assets/logo.svg")}
            className="max-w-56 max-h-12"
          />
        </View>

        <View className="hidden md:flex flex-row items-center gap-6">
          {sections.map((section) => (
            <TouchableOpacity
              key={section}
              className="py-2"
              onPress={() => scrollToSection(section)}
            >
              <Text className="font-medium text-[#39506b] hover:text-[#f0c14b] text-sm capitalize">
                {section}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="hidden md:flex flex-row gap-3">
          <TouchableOpacity className="px-4 py-2 rounded-md">
            <Text className="font-medium text-[#39506b] text-sm">
              Contactar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#f0c14b] px-4 py-2 rounded-md">
            <Text className="font-medium text-[#39506b] text-sm">
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        </View>

        <View className="md:hidden">
          <TouchableOpacity
            onPress={() => setMenuOpen(!menuOpen)}
            className="p-2"
          >
            <View className="relative justify-center w-6 h-6">
              <View
                className={`
                  absolute w-6 h-0.5 rounded bg-[#39506b] transition-all duration-300
                  ${menuOpen ? "rotate-45 top-2.5" : "top-0"}
                `}
              />

              <View
                className={`
                  absolute w-6 h-0.5 rounded bg-[#39506b] transition-all duration-300
                  ${menuOpen ? "opacity-0" : "top-2.5"}
                `}
              />
              <View
                className={`
                  absolute w-6 h-0.5 rounded bg-[#39506b] transition-all duration-300
                  ${menuOpen ? "-rotate-45 top-2.5" : "top-5"}
                `}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {menuOpen && (
        <View className="md:hidden bg-[#fdf6e3] px-6 py-4 border-[#f0e6cc] border-t w-full h-screen">
          <Text
            className="mb-3 font-bold text-[#f0c14b] text-4xl"
            style={{ fontFamily: "Tinos-Bold" }}
          >
            DWELLINGPLUS
          </Text>
          {sections.map((section) => (
            <TouchableOpacity
              key={section}
              onPress={() => {
                scrollToSection(section);
                setMenuOpen(false);
              }}
              className="py-2"
            >
              <Text className="py-5 font-medium text-[#39506b] text-base capitalize">
                {section}
              </Text>
            </TouchableOpacity>
          ))}

          <View className="my-5 border-[#f0e6cc] border-t" />

          <View className="flex flex-row gap-3">
            <TouchableOpacity className="px-4 py-2 rounded-md">
              <Text className="font-medium text-[#39506b] text-sm">
                Contactar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#f0c14b] px-4 py-2 rounded-md">
              <Text className="font-medium text-[#39506b] text-sm">
                Iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
function LandingSection() {
  return (
    <FadeInView>
      <View className="flex lg:justify-center items-center bg-[#fdf6e3] mt-12 px-6 w-full h-screen">
        <View className="flex lg:flex-row flex-col items-center lg:items-start gap-3 mx-auto w-full max-w-7xl">
          {/* Logo a la izquierda con más espacio */}
          <View className="flex flex-shrink-0 justify-center lg:justify-start w-full lg:w-1/2">
            <WritingLogo />
          </View>

          {/* Divider vertical para pantallas grandes */}
          {/* <View className="hidden lg:block mx-6 border-[#f0c14b] border-l-2 h-48" /> */}

          {/* Contenido a la derecha */}
          <View className="lg:pl-14 border-l-[#f0c14b] lg:border-l-2 w-full lg:w-1/2 lg:text-left text-center">
            <Text
              className="mb-3 text-[#39506b] text-4xl md:text-6xl"
              style={{ fontFamily: "Tinos-Italic" }}
            >
              Upgrade your property
            </Text>

            <Text
              className="mb-5 font-extralight text-[#5a6b8c] text-lg"
              style={{ fontFamily: "Tinos-Regular" }}
            >
              Our goal is to help you develop your property. We work with
              passion to meet the expectations of homeowners and developers.
              <Text className="text-[#f0c14b]"> DWELLINGPLUS </Text> handles the
              entire process making it easier for the owner to achieve their
              dream.
            </Text>

            <View className="flex sm:flex-row flex-col justify-center lg:justify-start gap-4">
              <TouchableOpacity className="bg-[#f0c14b] px-6 py-3 rounded-md">
                <Text className="font-medium text-[#39506b] text-base text-center">
                  Comenzar ahora
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text className="px-6 py-3 font-medium text-[#39506b] text-base text-center">
                  Más información →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </FadeInView>
  );
}

function ServicesSection() {
  const services = [
    {
      title: "Let's build an ADU",
      description:
        "Turn your available space into a source of value with an Accessory Dwelling Unit (ADU).",
      icon: "🏠",
    },
    {
      title: "Home Remodeling and Addition",
      description:
        "Transform your home to better suit your lifestyle and family needs.",
      icon: "🛠️",
    },
    {
      title: "Inspiring Backyard Spaces",
      description:
        "Turn your backyard into an oasis designed for comfort and conviviality.",
      icon: "🌳",
    },
    {
      title: "General Construction and Repair",
      description:
        "We offer comprehensive solutions for construction, maintenance, painting, and repairs.",
      icon: "🧱",
    },
    {
      title: "Financial Support",
      description:
        "We help you access the financial resources available to develop construction projects.",
      icon: "💵",
    },
  ];

  return (
    <View className="flex flex-col justify-center items-center bg-[#fdf6e3] px-6 lg:h-screen">
      <View className="mx-auto w-full max-w-6xl">
        <Text
          className="mb-3 font-bold text-[#39506b] text-3xl md:text-4xl text-center"
          style={{ fontFamily: "Tinos-Bold" }}
        >
          Our Services
        </Text>
        <Text
          className="mb-10 font-extralight text-[#5a6b8c] text-lg md:text-xl text-center"
          style={{ fontFamily: "Tinos-Regular" }}
        >
          We offer a wide range of services to meet your needs.
        </Text>

        <View className="gap-8 grid grid-cols-1 md:grid-cols-3 mx-5">
          {services.map((service, index) => (
            <View
              key={index}
              className="bg-[#f9f1d9] p-6 border border-[#f0e6cc] hover:border-[#f0c14b] rounded-xl transition-all"
            >
              <Text className="mb-4 text-3xl">{service.icon}</Text>
              <Text className="mb-2 font-semibold text-[#39506b] text-xl">
                {service.title}
              </Text>
              <Text className="text-[#5a6b8c]">{service.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    state: "",
    city: "",
    postal: "",
  });
  const [errors, setErrors] = useState({ name: false, email: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>();

  // Función con debounce para buscar sugerencias
  const handleAddressChange = (text: string) => {
    setFormData((prev) => ({ ...prev, address: text }));

    if (searchDebounce) clearTimeout(searchDebounce);

    setSearchDebounce(
      setTimeout(() => {
        if (text.length > 2) {
          fetchAddressSuggestions(text);
        } else {
          setAddressSuggestions([]);
          setShowSuggestions(false);
        }
      }, 500)
    );
  };

  // Obtener sugerencias de OpenStreetMap Nominatim
  const fetchAddressSuggestions = async (query: string) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5&countrycodes=us`
      );

      setAddressSuggestions(
        response.data.map((item: any) => ({
          display: item.display_name,
          address: {
            city:
              item.address.city ||
              item.address.town ||
              item.address.village ||
              "",
            state: item.address.state || "",
            postal: item.address.postcode || "",
          },
        }))
      );

      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Manejar selección de dirección
  const handleAddressSelect = (suggestion: any) => {
    setFormData((prev) => ({
      ...prev,
      address: suggestion.display.split(",")[0],
      city: suggestion.address.city,
      state: suggestion.address.state,
      postal: suggestion.address.postal,
    }));
    setShowSuggestions(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim(),
    };
    setErrors(newErrors);

    if (newErrors.name || newErrors.email) {
      Alert.alert("Error", "Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const prospectData = {
        name: formData.name,
        lastName: formData.lastName || "", // Puedes dejarlo vacío o pedirlo en el formulario
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        state: formData.state || "", // Puedes dejarlo vacío o pedirlo en el formulario
        city: formData.city || "", // Puedes dejarlo vacío o pedirlo en el formulario
        postal: formData.postal || "", // Puedes dejarlo vacío o pedirlo en el formulario
        metadata: {
          message: formData.message,
          contactDate: new Date().toISOString(),
        },
      };

      const response = await fetch(`${SERVER_URL}/prospect/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prospectData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      Alert.alert("Success", "Your message has been sent successfully!");

      // Reset form after successful submission
      setFormData({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        message: "",
        state: "",
        city: "",
        postal: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert(
        "Error",
        "There was a problem sending your message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex justify-center items-center bg-[#f9f1d9] px-6 w-full">
      <View className="flex lg:flex-row flex-col gap-5 bg-white drop-shadow-xl mx-auto my-20 rounded-xl w-full max-w-4xl">
        {/* Contact Info */}
        <View className="bg-[#f0c14b] drop-shadow-md p-5 lg:p-16 rounded-xl w-full lg:w-1/2">
          <Text className="mb-6 font-bold text-[#39506b] text-2xl md:text-3xl text-center">
            Contact Information
          </Text>
          <Text className="text-[#5a6b8c] text-lg lg:text-left text-center">
            Get in touch with us for any questions or inquiries.
          </Text>
          <View className="flex-row gap-10 lg:gap-20 lg:grid lg:grid-cols-2 m-auto mt-10 lg:mt-20 pb-5">
            <TouchableOpacity
              onPress={() => Linking.openURL("tel:4706011911")}
              className="flex-row justify-center items-center gap-2 hover:drop-shadow-md"
            >
              <Image
                source={require("../../assets/circle-phone-flip.png")}
                className="max-w-9 lg:max-w-8 max-h-9 lg:max-h-8"
              />
              <Text className="hidden lg:flex items-center gap-5 font-semibold text-[#39506b] text-lg lg:text-xl">
                470-601-1911
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("sms:4706011911")}
              className="flex-row justify-center items-center gap-2 hover:drop-shadow-md"
            >
              <Image
                source={require("../../assets/puntos-de-comentario.png")}
                className="max-w-9 lg:max-w-8 max-h-9 lg:max-h-8"
              />
              <Text className="hidden lg:flex items-center gap-5 font-semibold text-[#39506b] text-lg lg:text-xl">
                Direct Message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://wa.me/1234567890")}
              className="flex-row justify-center items-center gap-2 hover:drop-shadow-md"
            >
              <Image
                source={require("../../assets/whatsapp (2).png")}
                className="max-w-9 lg:max-w-8 max-h-9 lg:max-h-8"
              />
              <Text className="hidden lg:flex items-center gap-5 font-semibold text-[#39506b] text-lg lg:text-xl">
                WhatsApp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("mailto:osmel.rubido@gmail.com")}
              className="flex-row justify-center items-center gap-2 hover:drop-shadow-md"
            >
              <Image
                source={require("../../assets/sobre.png")}
                className="max-w-9 lg:max-w-8 max-h-9 lg:max-h-8"
              />
              <Text className="hidden lg:flex items-center gap-5 font-semibold text-[#39506b] text-lg lg:text-xl">
                Email
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View className="flex-1 space-y-4 m-4 min-w-0">
          <View className="flex flex-row gap-4">
            <View className="w-1/2">
              <InputField
                label="First Name"
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="First Name"
                error={errors.name}
              />
            </View>
            <View className="w-1/2">
              <InputField
                label="Last Name"
                value={formData.lastName}
                onChangeText={(text) => handleChange("lastName", text)}
                placeholder="Last Name"
              />
            </View>
          </View>

          <View className="relative flex flex-row w-full">
            <View className="w-1/2">
              <InputField
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Email"
                keyboardType="email-address"
                error={errors.email}
              />
            </View>
            <View className="right-0 absolute w-2/5">
              <InputField
                label="Phone"
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
                placeholder="Phone"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View className="relative z-10">
            <InputField
              label="Address"
              value={formData.address}
              onChangeText={handleAddressChange}
              placeholder="Start typing your address"
              onFocus={() =>
                formData.address.length >= 3 && setShowSuggestions(true)
              }
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && addressSuggestions.length > 0 && (
              <View className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {addressSuggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleAddressSelect(item)}
                    className="p-3 border-b border-gray-100"
                  >
                    <Text className="text-sm">{item.display}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Campos autocompletados (ciudad, estado, código postal) */}
          <View className="flex flex-row gap-4">
            <View className="flex-1">
              <InputField
                label="City"
                value={formData.city}
                onChangeText={(text) => handleChange("city", text)}
                placeholder="City"
              />
            </View>
            <View className="w-1/4">
              <InputField
                label="State"
                value={formData.state}
                onChangeText={(text) => handleChange("state", text)}
                placeholder="State"
              />
            </View>
            <View className="w-1/4">
              <InputField
                label="ZIP Code"
                value={formData.postal}
                onChangeText={(text) => handleChange("postal", text)}
                placeholder="ZIP"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TextAreaField
            label="Message"
            value={formData.message}
            onChangeText={(text) => handleChange("message", text)}
            placeholder="Your message"
          />

          <SubmitButton
            onPress={handleSubmit}
            label={isSubmitting ? "Sending..." : "Send Message"}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </View>
  );
}

function Footer() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="bg-[#fdf6e3] border-[#f0e6cc] border-t"
      style={{ paddingBottom: bottom }}
    >
      <View className="mx-auto px-6 py-2 w-full max-w-6xl">
        <View className="flex md:flex-row flex-col justify-between items-center w-full">
          <View className="flex items-center md:items-start mb-6 md:mb-0">
            <View className="flex-row items-center">
              <Image
                source={require("../../assets/3.png")}
                className="mr-2 rounded-lg max-w-56 max-h-12"
              />
            </View>
            <Text className="mt-2 text-[#5a6b8c] text-sm">
              © {new Date().getFullYear()} DwellingPlus. All rights reserved.
            </Text>
            <Text className="mt-1 text-[#5a6b8c] text-xs">
              Map data © OpenStreetMap contributors
            </Text>
          </View>

          <View className="gap-8 grid grid-cols-2">
            <View className="space-y-2">
              <Text className="font-semibold text-[#39506b] text-sm">
                Product
              </Text>
              <View className="space-y-1">
                <Text className="text-[#5a6b8c] text-sm">Features</Text>
                <Text className="text-[#5a6b8c] text-sm">Pricing</Text>
                <Text className="text-[#5a6b8c] text-sm">Documentation</Text>
              </View>
            </View>

            <View className="space-y-2">
              <Text className="font-semibold text-[#39506b] text-sm">
                Company
              </Text>
              <View className="space-y-1">
                <Text className="text-[#5a6b8c] text-sm">About</Text>
                <Text className="text-[#5a6b8c] text-sm">Blog</Text>
                <Text className="text-[#5a6b8c] text-sm">Careers</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
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
};

function InputField({
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
}: InputFieldProps) {
  return (
    <View className="mb-3">
      <Text className="mb-1 font-medium text-[#39506b] text-xl">
        {label}
        {error && <Text className="text-red-500"> *</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={keyboardType}
        onFocus={onFocus}
        onBlur={onBlur}
        editable={editable}
        autoCapitalize={autoCapitalize}
        className={`bg-white px-3 border ${
          error
            ? "border-red-500"
            : editable
            ? "border-[#f0e6cc]"
            : "border-gray-300"
        } rounded-md h-10 text-[#39506b] ${!editable && "bg-gray-100"}`}
        selectionColor="#f0c14b"
      />
      {error && (
        <Text className="text-red-500 text-xs mt-1">
          This field is required
        </Text>
      )}
    </View>
  );
}
function TextAreaField({
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
      <Text className="mt-4 mb-1 font-medium text-[#39506b] text-xl">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={true}
        numberOfLines={5}
        className="bg-white p-3 border border-[#f0e6cc] rounded-md h-32 text-[#39506b7a]"
        textAlignVertical="top"
      />
    </View>
  );
}

function SubmitButton({
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
      className={`mt-4 px-6 py-3 rounded-md ${
        disabled ? "bg-gray-400" : "bg-[#f0c14b]"
      }`}
    >
      <Text className="font-medium text-[#39506b] text-base text-center">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
