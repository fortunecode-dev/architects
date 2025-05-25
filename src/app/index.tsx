import { useRef, useEffect, useState } from "react";
import {
  Animated,
  ViewProps,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Alert,
  TextInputProps,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal, Pressable } from "react-native";
import {
  MAIL_CONTACT,
  PHONE_CONTACT,
  SERVER_URL,
  WHATSAPP_CONTACT,
} from "@env";
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Constants
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLORS = {
  primary: "#315072",
  secondary: "#f0c14b",
  accent: "#d4a017",
  background: "#fce798",
  card: "#f9f1d9",
  text: "#315072",
  lightText: "#f5e5a6",
  border: "#e8d8b0",
  error: "#e53e3e",
};

const FONTS = {
  body: "Arial",
};

export default function Page() {
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = {
    inicio: useRef<View>(null),
    services: useRef<View>(null),
    faq: useRef<View>(null),
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

  const sections = ["inicio", "services", "faq"];

  return (
    <View className="flex-1 bg-white">
      <Header sections={sections} scrollToSection={scrollToSection} />
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View ref={sectionRefs.inicio}>
          <LandingSection scrollToSection={scrollToSection} />
        </View>
        <View ref={sectionRefs.services}>
          <ServicesSection />
        </View>
        <View ref={sectionRefs.faq}>
          <FAQSection scrollToSection={scrollToSection} />
        </View>
        <View ref={sectionRefs.contact}>
          <ContactSection />
        </View>
        <Footer scrollToSection={scrollToSection} />
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 50;
      if (show !== isScrolled) setIsScrolled(show);
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  return (
    <View
      style={{ paddingTop: top }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#FBEFBE] border-b border-[#e8d8b0] `}
    >
      <View className="flex flex-row items-center justify-between px-6 py-3 h-16 max-w-7xl mx-auto w-full">
        {/* Left: Logo */}
        <View className="flex flex-row items-center flex-shrink-0">
          <Image
            source={require("../../public/logo.svg")}
            style={{
              width: 90,
              height: 40,
              resizeMode: "contain",
              opacity: 1, // Mantener visibilidad en ambos casos
            }}
          />
        </View>

        {/* Center: Sections as Row */}
        <View className="hidden md:flex flex-row items-center justify-center gap-6 flex-1">
          {sections.map((section) => (
            <TouchableOpacity
              key={section}
              onPress={() => scrollToSection(section)}
              className="group relative py-2"
            >
              <Text
                className={`font-bold text-sm capitalize transition-colors duration-200 text-[#315072]`}
              >
                {section}
              </Text>
              <View
                className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-[#495a6d]`}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Right: Contact Button */}
        <View className="hidden md:flex flex-row items-center flex-shrink-0">
          <TouchableOpacity
            className={`px-4 py-2 rounded-md  transition-all duration-300 bg-[#ffdb80] hover:bg-[#FDE490]  `}
            onPress={() => scrollToSection("contact")}
          >
            <Text className={`font-bold text-sm text-[#315072]`}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Mobile Menu Button */}
        <View className="md:hidden flex-shrink-0">
          <TouchableOpacity
            onPress={() => setMenuOpen(!menuOpen)}
            className="p-2 -mr-2"
          >
            <View className="relative justify-center w-6 h-6">
              <View
                className={`absolute w-6 h-0.5 rounded-full ${
                  isScrolled ? "bg-[#315072]" : "bg-[#315072]"
                } transition-all duration-300 ${
                  menuOpen ? "rotate-45 top-1/2" : "top-0"
                }`}
              />
              <View
                className={`absolute w-6 h-0.5 rounded-full ${
                  isScrolled ? "bg-[#315072]" : "bg-[#315072]"
                } transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "top-1/2"
                }`}
              />
              <View
                className={`absolute w-6 h-0.5 rounded-full ${
                  isScrolled ? "bg-[#315072]" : "bg-[#315072]"
                } transition-all duration-300 ${
                  menuOpen ? "-rotate-45 top-1/2" : "top-full"
                }`}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile Menu */}
      {menuOpen && (
        <View
          className={`md:hidden ${
            isScrolled ? "bg-[#f5e5a6]" : "bg-[#315072]"
          } px-6 py-4 border-t ${
            isScrolled ? "border-[#e8d8b0]" : "border-white/20"
          } w-full`}
        >
          <View className="max-w-7xl mx-auto">
            <Text
              className={`mb-4 font-bold text-3xl ${
                isScrolled ? "text-[#d4a017]" : "text-white"
              }`}
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
                className={`py-3 border-b ${
                  isScrolled ? "border-[#e8d8b0]" : "border-white/20"
                } last:border-0`}
              >
                <Text
                  className={`font-medium text-lg capitalize ${
                    isScrolled ? "text-[#315072]" : "text-white"
                  }`}
                >
                  {section}
                </Text>
              </TouchableOpacity>
            ))}

            <View className="mt-6">
              <TouchableOpacity
                onPress={() => {
                  scrollToSection("contact");
                  setMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-md shadow-sm ${
                  isScrolled ? "bg-[#f0c14b]" : "bg-white"
                }`}
              >
                <Text
                  className={`font-medium text-sm text-center ${
                    isScrolled ? "text-[#39506b]" : "text-[#315072]"
                  }`}
                >
                  Contact
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function LandingSection({
  scrollToSection,
}: {
  scrollToSection: (section: string) => void;
}) {
  return (
    <FadeInView>
      <View className="flex justify-center items-center bg-[#fce798] px-6 w-full h-screen">
        <View className="flex lg:flex-row flex-col items-center justify-center gap-6 mx-auto w-full max-w-7xl">
          {/* Logo Container */}
          <View className="flex flex-1 w-full lg:w-auto justify-center items-center lg:items-end lg:pr-14">
            <Image
              source={require("../../public/logo-navy.png")}
              style={{
                width: "100%",
                resizeMode: "contain",
              }}
              className="w-full lg:max-w-none" // alternativa con clases
            />
          </View>

          {/* Vertical Divider */}
          <View className="hidden lg:block border-l-2 border-[#FBEFBE] h-64 self-center" />

          {/* Content */}
          <View className="flex-1 lg:pl-14 w-full lg:text-left text-center">
            <View className="flex flex-col justify-center h-full">
              <Text
                className="font-extralight text-[#315072] text-lg"
                style={{ fontFamily: FONTS.body }}
              >
                Our goal is to help you develop your property. We work with
                passion to meet the expectations of homeowners and developers.
              </Text>
              <Text
                className="mb-5 font-extralight text-[#315072] text-lg"
                style={{ fontFamily: FONTS.body }}
              >
                <Text className="text-[#315072] font-bold">DWELLINGPLUS </Text>{" "}
                handles the entire process making it easier for the owner to
                achieve their dream.
              </Text>

              <View className="flex sm:flex-row flex-col justify-center lg:justify-start gap-4">
                <TouchableOpacity
                  onPress={() => scrollToSection("contact")}
                  className="bg-[#FBEFBE] px-6 py-3 rounded-md  transition-shadow duration-300"
                >
                  <Text className="font-medium text-[#315072] text-base text-center">
                    Start your project
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => scrollToSection("services")}
                  className="px-6 py-3 hover:bg-[#f9f1d9]/30 rounded-md transition-colors duration-300"
                >
                  <Text className="font-medium text-[#315072] text-base text-center">
                    More information →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </FadeInView>
  );
}

function ServiceCard({
  icon,
  title,
  description,
  cont,
}: {
  icon: string;
  title: string;
  description: string;
  cont?: string;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="bg-[#FBEFBE] mb-4 p-6 border border-[#f0e6cc] rounded-xl hover:shadow-sm transition-shadow duration-300">
      <Text className="mb-4 text-3xl">{icon}</Text>
      <Text className="mb-2 font-semibold text-[#315072] text-xl">{title}</Text>
      <Text className="text-[#315072]">{description}</Text>
      <Pressable onPress={() => setModalVisible(true)} className="mt-5">
        <Text className="font-medium text-[#315072] hover:text-[#315072] transition-colors duration-300">
          Read More →
        </Text>
      </Pressable>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-xl">
            <Text className="mb-2 text-2xl text-[#315072]">
              {icon} {title}
            </Text>
            <Text className="my-6 text-[#315072] text-lg">{cont}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="self-end bg-[#FDE490] px-4 py-2 rounded-md hover:bg-[#ffd753] transition-colors duration-300"
            >
              <Text className="font-medium text-[#315072]">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ServicesSection() {
  const services = [
    {
      title: "Let's build an ADU",
      description:
        "Turn your available space into a source of value with an Accessory Dwelling Unit (ADU).",
      cont: "Turn your available space into a source of value with an Accessory Dwelling Unit (ADU). Our ADU construction service allows you to make the most of your property, whether to generate rental income, comfortably house family members, or expand your living space. We design functional and efficient solutions that comply with local regulations, optimizing energy and materials for a sustainable home. With a smart investment, an ADU can offer you financial independence and flexibility, adapting to your current and future needs.",
      icon: "🏠",
    },
    {
      title: "Home Remodeling and Addition",
      description:
        "Transform your home to better suit your lifestyle and family needs.",
      cont: "Our home remodeling and expansion services are designed to optimize your existing floor plan, creating more functional, comfortable and efficient spaces. Whether it's redistributing key areas, expanding bedrooms or modernizing bathrooms, we help you make the most of every square foot in a strategic way. With intelligent design and construction solutions, we turn your home into an environment that flows naturally and enhances your well-being.",
      icon: "🛠️",
    },
    {
      title: "Inspiring Backyard Spaces",
      description:
        "Turn your backyard into an oasis designed for comfort and conviviality.",
      cont: "Our outdoor transformation service creates living areas with elegant pergolas, fire pits for warm moments, grills for unforgettable gatherings and a perfect balance of concrete pavers and natural grass. Cozy lighting enhances every detail, creating an ideal environment for relaxing, sharing and making the most of your home. Our architects and designers will turn your patio into a dream space for the whole family.",

      icon: "🌳",
    },
    {
      title: "General Construction and Repair",
      description:
        "We offer comprehensive solutions for construction, maintenance, painting, and repairs.",
      cont: "We offer comprehensive solutions for construction, maintenance, painting, repair of roofs, walls, floors and any damaged area of the building. Whether you need to develop a project from scratch or restore existing structures, our team is ready to deliver quality results. From structural improvements to detailed renovations, we provide reliable service tailored to your needs.",
      icon: "🧱",
    },
    {
      title: "Financial Support",
      description:
        "We help you access the financial resources available to develop construction and renovation projects.",
      cont: "Through credit options or structured loans, homeowners can invest in an Auxiliary Dwelling Unit (ADU) or improve their home, distributing the payment in affordable installments. This service provides financial flexibility, facilitating the materialization of projects without compromising economic stability.",
      icon: "💵",
    },
  ];

  return (
    <View className="flex flex-col justify-center items-center bg-[#fce798] px-6 lg:h-screen">
      <View className="mx-auto w-full max-w-6xl">
        <Text className="mb-3 font-bold text-[#315072] text-3xl md:text-4xl text-center">
          Our Services
        </Text>
        <Text
          className="mb-10 font-extralight text-[#315072] text-lg md:text-xl text-center"
          style={{ fontFamily: "Arial" }}
        >
          We offer a wide range of services to meet your needs.
        </Text>

        <View className="gap-1 lg:gap-8 grid grid-cols-1 md:grid-cols-3 mx-5">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              cont={service.cont}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
function FAQSection({
  scrollToSection,
}: {
  scrollToSection: (section: string) => void;
}) {
  const faqs = [
    {
      question: "What is an ADU and why should I build one?",
      answer:
        "An ADU (Accessory Dwelling Unit) is an additional structure on your property that can be used for rental, family, or to expand your space. It increases your property's value and provides flexibility.",
    },
    {
      question: "How long does a typical project take?",
      answer:
        "The time depends on the type of project, but most remodels and ADUs take between 3 and 6 months from design to completion.",
    },
    {
      question: "Can I finance my project?",
      answer:
        "Yes, we offer advice on accessing credit and financing so you can carry out your project without affecting your finances.",
    },
    {
      question: "What services do you offer besides construction?",
      answer:
        "We offer architectural design, permit management, remodeling, expansions, financial advice, and more.",
    },
    {
      question: "Do you work with clients outside of Atlanta?",
      answer:
        "Yes, we can evaluate projects in other areas. Contact us to discuss your case.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View className="flex flex-col justify-center items-center bg-[#fce798] px-6 py-16 lg:h-screen">
      <View className="mx-auto w-full max-w-3xl">
        <Text className="mb-6 font-bold text-[#315072] text-3xl text-center">
          Frequently Asked Questions
        </Text>
        {faqs.map((faq, idx) => (
          <View key={idx} className="mb-4 border-[#FBEFBE] border-b-2">
            <TouchableOpacity
              onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex flex-row justify-between items-center py-4"
            >
              <Text className="font-medium text-[#315072] text-lg">
                {faq.question}
              </Text>
              <Text className="text-[#315072] text-2xl">
                {openIndex === idx ? "−" : "+"}
              </Text>
            </TouchableOpacity>
            {openIndex === idx && (
              <Text className="pb-4 text-[#315072]">{faq.answer}</Text>
            )}
          </View>
        ))}
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
    <View className="flex justify-center items-center bg-[#fce798] px-6 w-full">
      <View className="flex lg:flex-row flex-col gap-5 bg-white drop-shadow-xl mx-auto my-20 rounded-xl w-full max-w-6xl">
        {/* Contact Info */}
        <View className="bg-[#FBEFBE] drop-shadow-md pt-7 pl-10 rounded-xl w-full lg:w-1/2">
          <Text className="mb-6 font-bold text-[#315072] text-2xl md:text-3xl text-left">
            Contact Information
          </Text>
          <Text className="text-[#315072] text-lg lg:text-left text-center">
            Get in touch with us for any questions or inquiries.
          </Text>
          <View className="flex-row gap-10 lg:gap-20 lg:grid lg:grid-cols-2 m-auto mt-10 lg:mt-20 pb-5">
            <View className="flex flex-col items-start gap-5 lg:gap-15">
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${PHONE_CONTACT}`)}
                className="flex-row justify-start items-center gap-2 hover:drop-shadow-md pb-5 border-[#ffffff63] border-b-2 w-96"
              >
                <Ionicons
                  name="call"
                  color={"#315072"}
                  size={30}
                  className="max-w-9 lg:max-w-8 max-h-9 lg:max-h-8"
                />

                <View className="gap-3 mb-2 p-2">
                  <Text className="lg:flex items-center gap-5 font-semibold text-[#315072] lg:text-md text-lg">
                    {PHONE_CONTACT}
                  </Text>
                  <Text className="lg:flex items-center gap-5">
                    Call now for a free consultation
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL(`mailto:${MAIL_CONTACT}`)}
                className="flex-row justify-start items-center gap-2 hover:drop-shadow-md border-[#ffffff63] w-96"
              >
                <Ionicons
                  name="mail"
                  color={"#315072"}
                  size={30}
                  className="max-w-9 lg:max-w-8 max-h-9 lg:max-h-8"
                />
                <View className="gap-3 mb-2 p-2">
                  <Text className="lg:flex items-center gap-5 font-semibold text-[#315072] lg:text-md text-lg">
                    {MAIL_CONTACT}
                  </Text>
                  <Text>Email us to discuss your project</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-row gap-10 lg:gap-20 lg:grid lg:grid-cols-2 m-auto mt-10 lg:mt-20 pb-5">
            <TouchableOpacity
              onPress={() => Linking.openURL(`sms:${PHONE_CONTACT}`)}
              className="flex-row justify-center items-center gap-2 hover:drop-shadow-md"
            >
              <MaterialIcons
                name="sms"
                color={"#315072"}
                size={40}
                className="max-w-9 lg:max-w-8 max-h-9 lg:max-h-8"
              />
              {/* <Text className="hidden lg:flex items-center gap-5 font-semibold text-[#315072] text-lg lg:text-xl">
                Direct Message
              </Text> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`https://wa.me/${WHATSAPP_CONTACT}`)
              }
              className="flex-row justify-center items-center gap-2 hover:drop-shadow-md"
            >
              <Ionicons
                name="logo-whatsapp"
                color={"#315072"}
                size={40}
                className="max-w-9 lg:max-w-8 max-h-9 lg:max-h-8"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View className="flex-1 space-y-1 m-2 pr-4 pb-3 min-w-0">
          <View className="flex flex-row justify-between gap-1 pt-5 w-full overflow-hidden">
            <View className="w-1/2">
              <InputField
                label="First Name"
                autoComplete="name"
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="First Name"
                error={errors.name}
              />
            </View>
            <View className="w-2/5 lg:w-60">
              <InputField
                label="Last Name"
                autoComplete="family-name"
                value={formData.lastName}
                onChangeText={(text) => handleChange("lastName", text)}
                placeholder="Last Name"
              />
            </View>
          </View>

          <View className="relative flex flex-row justify-between gap-2 w-full overflow-hidden">
            <View className="w-1/2">
              <InputField
                label="Email"
                autoComplete="email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Email"
                keyboardType="email-address"
                error={errors.email}
              />
            </View>
            <View className="w-2/5 lg:w-60">
              <InputField
                label="Phone"
                autoComplete="tel"
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
                placeholder="Phone"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View className="z-10 relative">
            <InputField
              label="Address"
              autoComplete="street-address"
              value={formData.address}
              onChangeText={handleAddressChange}
              placeholder="Start typing your address"
              onFocus={() =>
                formData.address.length >= 3 && setShowSuggestions(true)
              }
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && addressSuggestions.length > 0 && (
              <View className="top-full absolute bg-white shadow-lg mt-1 border border-gray-200 rounded-md w-full">
                {addressSuggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleAddressSelect(item)}
                    className="p-3 border-gray-100 border-b"
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
                autoComplete="postal-code"
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

function Footer({ scrollToSection }: any) {
  const { bottom } = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState<null | string>(null);
  const about = {
    dwelling: {
      title: "Dwelling",
      info: "Info",
    },
    fortuneCode: {
      title: "FortuneCode",
      info: "Info desarrollo",
    },
  };

  return (
    <View
      className="bg-[#FBEFBE] border-[#ffdb80] border-t"
      style={{ paddingBottom: bottom }}
    >
      <View className="mx-auto px-6 py-2 w-full max-w-6xl">
        <View className="flex md:flex-row flex-col justify-between items-center w-full">
          <View className="flex items-center md:items-start mb-6 md:mb-0">
            <View className="flex-row items-center">
              <Image
                source={require("../../public/logo-navy.png")}
                className="mr-2 rounded-lg max-w-56 max-h-12"
              />
            </View>
            <Text className="mt-2 text-[#315072] text-sm">
              DwellingPlus © {new Date().getFullYear()} All rights reserved.
            </Text>
            <Text className="mt-1 text-[#315072] text-xs">
              Map data © OpenStreetMap contributors
            </Text>
          </View>

          <View className="gap-8 grid grid-cols-2">
            <View className="space-y-2">
              <Text className="font-semibold text-[#315072] text-sm">
                Content
              </Text>
              <View className="space-y-1">
                <Text
                  className="text-[#315072] text-sm"
                  onPress={() => scrollToSection?.("services")}
                >
                  Services
                </Text>
                <Text
                  className="text-[#315072] text-sm"
                  onPress={() => scrollToSection?.("faq")}
                >
                  FAQs
                </Text>
              </View>
            </View>

            <View className="space-y-2">
              <Text className="font-semibold text-[#315072] text-sm">
                Company
              </Text>
              <View className="space-y-1">
                <Text
                  className="text-[#315072] text-sm"
                  onPress={() => setModalVisible("dwelling")}
                >
                  About
                </Text>
                <Text
                  className="text-[#315072] text-sm"
                  onPress={() => setModalVisible("fortuneCode")}
                >
                  Development
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Modal
        visible={!!modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-xl">
            <Text className="mb-2 text-2xl text-[#315072]">
              {about[modalVisible]?.title}
            </Text>
            <Text className="my-6 text-[#315072] text-lg">
              {about[modalVisible]?.info}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(null)}
              className="self-end bg-[#FDE490] px-4 py-2 rounded-md hover:bg-[#ffd753] transition-colors duration-300"
            >
              <Text className="font-medium text-[#315072]">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  autoComplete,
}: InputFieldProps) {
  return (
    <View className="mb-3">
      <Text className="mb-1 font-medium text-[#315072] text-xl">
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
        autoComplete={autoComplete}
        className={`bg-white px-3 border ${
          error
            ? "border-red-500"
            : editable
            ? "border-[#f0e6cc]"
            : "border-gray-300"
        } rounded-md h-10 text-[#315072] ${!editable && "bg-gray-100"}`}
        selectionColor="#f0c14b"
      />
      {error && (
        <Text className="mt-1 text-red-500 text-xs">
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
      <Text className="mt-4 mb-1 font-medium text-[#315072] text-xl">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={true}
        numberOfLines={5}
        className="bg-white p-3 border border-[#f0e6cc] rounded-md h-32 text-[#3150727a]"
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
        disabled ? "bg-gray-400" : "bg-[#ffdb80]"
      } hover:bg-[#FBEFBE]`}
    >
      <Text className="font-medium text-[#315072] text-base text-center hover:">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
