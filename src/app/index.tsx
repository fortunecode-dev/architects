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
  Touchable,
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
import { useWindowDimensions } from "react-native";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLORS = {
  primary: "#315072",
  secondary: "#f0c14b",
  accent: "#d4a017",
  background: "#FFFFFF",
  card: "#f9f1d9",
  text: "#315072",
  lightText: "#f5e5a6",
  border: "#c9e4ff",
  error: "#e53e3e",
};

const FONTS = {
  body: "Arial",
};

export default function Page() {
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = {
    home: useRef<View>(null),
    services: useRef<View>(null),
    faq: useRef<View>(null),
    contact: useRef<View>(null),
  };
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const scrollToSection = (sectionName: string, forceScroll = false) => {
    // Solo hacer scroll si es desktop o si se fuerza explícitamente (como desde el menú móvil)
    if (isDesktop || forceScroll) {
      sectionRefs[sectionName].current?.measureLayout(
        scrollViewRef.current?.getInnerViewNode(),
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y, animated: true });
        },
        () => {}
      );
    }
  };

  const sections = ["home", "services", "faq"];

  return (
    <View className="flex-1 bg-white">
      <Header sections={sections} scrollToSection={scrollToSection} />
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled={isDesktop} // <-- Solo habilitar paging en desktop
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View ref={sectionRefs.home}>
          <LandingSection scrollToSection={scrollToSection} />
        </View>
        <View ref={sectionRefs.services}>
          <ServicesSection scrollToSection={scrollToSection} />
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
  scrollToSection: (section: string, force?: boolean) => void;
}) {
  const { top } = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  useEffect(() => {
    // Solo para web, ignora en móvil
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        const show = window.scrollY > 50;
        if (show !== isScrolled) setIsScrolled(show);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isScrolled]);

  return (
    <View
      style={{ paddingTop: top }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#e1f0ff] border-b border-[#c9e4ff]`}
    >
      <View className="flex flex-row justify-between items-center mx-auto px-4 py-2 w-full max-w-7xl h-12">
        {" "}
        {/* Cambiado px-6 a px-4, py-3 a py-2, h-16 a h-14 */}
        {/* Left: Logo */}
        <View className="flex flex-row flex-shrink-0 items-center">
          {" "}
          <TouchableOpacity onPress={() => scrollToSection("home")}>
            <Image
              source={require("../../public/logo.svg")}
              style={{
                marginTop: 12,
                width: 158, // Reducido de 90 a 80
                resizeMode: "contain",
                opacity: 1,
              }}
            />
          </TouchableOpacity>
        </View>
        {/* Center: Sections as Row */}
        <View className="hidden md:flex flex-row flex-1 justify-center items-center gap-4">
          {" "}
          {/* Reducido gap de 6 a 4 */}
          {sections.map((section) => (
            <TouchableOpacity
              key={section}
              onPress={() => scrollToSection(section)}
              className="group relative py-1"
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
        <View className="hidden md:flex flex-row flex-shrink-0 items-center">
          <TouchableOpacity
            className={`px-3 py-1.5 rounded-md transition-all duration-300 bg-[#badcff] hover:bg-[#a6d2ff]`}
            onPress={() => scrollToSection("contact")}
          >
            <Text className={`font-bold text-sm text-[#315072]`}>Contact</Text>
          </TouchableOpacity>
          {/* Iconos de redes sociales */}
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.facebook.com/tu-negocio")}
            className="ml-3"
            accessibilityLabel="Facebook"
          >
            <Ionicons name="logo-facebook" size={26} color="#315072" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.instagram.com/tu-negocio")}
            className="ml-2"
            accessibilityLabel="Instagram"
          >
            <Ionicons name="logo-instagram" size={26} color="#315072" />
          </TouchableOpacity>
        </View>
        {/* Mobile Menu Button (sin cambios ya que ya es compacto) */}
        <View className="md:hidden flex-shrink-0">
          <TouchableOpacity
            onPress={() => setMenuOpen(!menuOpen)}
            className="-mr-2 p-2"
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

      {/* Mobile Menu (sin cambios ya que no afecta la altura del header) */}
      {menuOpen && (
        <View
          className={`md:hidden h-screen justify-center items-center ${
            isScrolled ? "bg-[#f5e5a6]" : "bg-[#315072]"
          } px-6 py-4 border-t ${
            isScrolled ? "border-[#c9e4ff]" : "border-white/20"
          } w-full`}
        >
          <View className="max-w-7xl">
            <Text
              className={`mb-4 font-bold text-3xl  ${
                isScrolled ? "text-[#d4a017]" : "text-white"
              }`}
            >
              DWELLINGPLUS
            </Text>

            {sections.map((section) => (
              <TouchableOpacity
                key={section}
                onPress={() => {
                  scrollToSection(section, true);
                  setMenuOpen(false);
                }}
                className={`py-3 border-b ${
                  isScrolled ? "border-[#e8d8a0]" : "border-white/20"
                } last:border-0`}
              >
                <Text
                  className={`font-medium text-lg capitalize text-center ${
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
                  scrollToSection("contact", true);
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
              <View className="flex flex-row justify-center gap-4 mt-4">
                <TouchableOpacity
                  onPress={() => Linking.openURL("https://www.facebook.com/tu-negocio")}
                  accessibilityLabel="Facebook"
                >
                  <Ionicons name="logo-facebook" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL("https://www.instagram.com/tu-negocio")}
                  accessibilityLabel="Instagram"
                >
                  <Ionicons name="logo-instagram" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
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
  scrollToSection: (section: string, force?: boolean) => void;
}) {
  const isDesktop = window.innerWidth >= 1024;
  return (
    <FadeInView>
  <View className="flex flex-1 px-6 w-full h-screen">
    <View className="flex lg:flex-row flex-col justify-between lg:items-center px-10 lg:px-32 w-full h-screen">
      {/* Columna izquierda */}
      <View className="z-50 flex flex-col justify-center items-start w-full lg:w-1/2 h-full">
        <Image
          source={require("../../public/logo-navy.png")}
          style={{
            width: isDesktop ? 480 : 360,
            height: isDesktop ? 180 : 120,
            resizeMode: "contain",
            alignSelf: "flex-start",
            backgroundColor: "#"
          }}
          className="bg-blue-200/80 lg:bg-transparent shadow-lg lg:shadow-none mb-4 lg:mb-0 rounded-lg"
          
        />
        <Text className="bg-blue-200/80 lg:bg-transparent shadow-lg lg:shadow-transparent mt-5 mb-8 p-5 lg:p-0 pt-5 rounded-xl font-medium text-blue-500 lg:text-[#315072] text-lg lg:text-xl">
          Our goal is to help you develop your property. We work with
          passion to meet the expectations of home owners and developers.
        </Text>
        <View className="flex flex-row justify-center lg:justify-start items-center lg:items-start gap-12 mt-2 w-full">
        
        <TouchableOpacity
          onPress={() => scrollToSection("contact")}
          className="bg-blue-200 hover:bg-blue-100 px-4 py-2 rounded-md"
        >
          <Text className="font-medium text-[#315072] text-base text-center">
            Get Started
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => scrollToSection("services", true)}
          className="bg-blue-200 hover:bg-blue-100 px-4 py-2 rounded-md"
        >
          <Text className="font-medium text-[#315072] text-base text-center">
            More Information →
          </Text>
        </TouchableOpacity>
      </View>
      </View>
      
      {/* Columna derecha */}
      <View className="z-0 absolute lg:relative flex flex-col justify-center items-center lg:bg-blue-50 w-1/6 lg:w-2/3 h-full" style={{ clipPath: isDesktop ? "polygon(19% 0, 100% 0, 100% 100%, 0% 100%)" : "none" }}>
        <Image
          source={require("../../public/landing-imagelanding-image.png")}
          style={{
            width: 1250,
            height: 650,
            resizeMode: "cover",
          }}
          className="z-30 mb-6"
        />
      </View>
      
    </View>
    
  </View>
</FadeInView>
  );
}



function ServicesSection({ scrollToSection }: { scrollToSection?: (section: string, force?: boolean) => void }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionSent, setQuestionSent] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const scrollViewRef = useRef<ScrollView>(null);

  const services = [
    {
      title: "Let's build an ADU",
      description: "Turn your available space into a source of value with an Accessory Dwelling Unit (ADU).",
      cont: "Turn your available space into a source of value with an Accessory Dwelling Unit (ADU). Our ADU construction service allows you to make the most of your property, whether to generate rental income, comfortably house family members, or expand your living space. We design functional and efficient solutions that comply with local regulations, optimizing energy and materials for a sustainable home. With a smart investment, an ADU can offer you financial independence and flexibility, adapting to your current and future needs.",
      images: [require("../../public/ADU.jpg")],
    },
    {
      title: "Home Remodeling and Addition",
      description: "Transform your home to better suit your lifestyle and family needs.",
      cont: "Our home remodeling and expansion services are designed to optimize your existing floor plan, creating more functional, comfortable and efficient spaces. Whether it's redistributing key areas, expanding bedrooms or modernizing bathrooms, we help you make the most of every square foot in a strategic way. With intelligent design and construction solutions, we turn your home into an environment that flows naturally and enhances your well-being.",
      images: [require("../../public/Remodelation.jpg")],
    },
    {
      title: "Inspiring Backyard Spaces",
      description: "Turn your backyard into an oasis designed for comfort and conviviality.",
      cont: "Our outdoor transformation service creates living areas with elegant pergolas, fire pits for warm moments, grills for unforgettable gatherings and a perfect balance of concrete pavers and natural grass. Cozy lighting enhances every detail, creating an ideal environment for relaxing, sharing and making the most of your home. Our architects and designers will turn your patio into a dream space for the whole family.",
      images: [require("../../public/Backyard Spaces.jpg")],
    },
    {
      title: "General Construction and Repair",
      description: "We offer comprehensive solutions for construction, maintenance, painting, and repairs.",
      cont: "We offer comprehensive solutions for construction, maintenance, painting, repair of roofs, walls, floors and any damaged area of the building. Whether you need to develop a project from scratch or restore existing structures, our team is ready to deliver quality results. From structural improvements to detailed renovations, we provide reliable service tailored to your needs.",
      images: [require("../../public/Repair.jpg")],
    },
    {
      title: "Financial Support",
      description: "We help you access the financial resources available to develop construction and renovation projects.",
      cont: "Through credit options or structured loans, homeowners can invest in an Auxiliary Dwelling Unit (ADU) or improve their home, distributing the payment in affordable installments. This service provides financial flexibility, facilitating the materialization of projects without compromising economic stability.",
      images: [require("../../public/Financial Support.jpg")],
    },
  ];

  const handleGetStarted = () => {
    setModalVisible(false);
    setTimeout(() => {
      if (scrollToSection) {
        scrollToSection("contact", true);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 300);
      }
    }, 400);
  };

  const handleSendQuestion = () => {
    if (questionText.trim().length < 5) return;
    setQuestionSent(true);
    setTimeout(() => {
      setQuestionModalVisible(false);
      setQuestionText("");
      setQuestionSent(false);
    }, 1500);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View className="flex flex-col justify-center items-center bg-[#FFFFFF] px-6 pt-40 lg:pt-10 lg:h-screen">
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
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

          <View className="gap-0 lg:gap-5 grid grid-cols-1 md:grid-cols-3 mx-5">
            {services.map((service, index) => (
              <View
                key={index}
                className="flex flex-col bg-[#e1f0ff] hover:shadow-sm mb-2 p-3 border border-[#c9e4ff] rounded-xl transition-shadow duration-300"
              >
                <Image
                  source={service.images[0]}
                  style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 12,
                    marginBottom: 12,
                  }}
                  resizeMode="cover"
                />
                <Text className="mb-1 lg:mb-2 font-semibold text-[#315072] text-xl">
                  {service.title}
                </Text>
                <Text className="text-[#315072]">{service.description}</Text>
                <Pressable
                  onPress={() => {
                    setSelectedService(service);
                    setModalVisible(true);
                  }}
                  className="mt-4"
                >
                  <Text className="font-medium text-[#315072] underline transition-colors duration-300">
                    Read More →
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Service Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="relative lg:flex-row flex-col bg-white p-6 rounded-xl w-11/12 max-w-4xl">
            <TouchableOpacity
              onPress={handleCloseModal}
              className="top-4 right-4 z-10 absolute"
            >
              <Ionicons name="close" size={28} color="#315072" />
            </TouchableOpacity>
            
            <View className="flex-1 mb-6 lg:mb-0 pr-0 lg:pr-6">
              <Text className="mb-2 font-bold text-[#315072] text-2xl">
                {selectedService?.title}
              </Text>
              <Text className="my-6 text-[#315072] text-md">{selectedService?.cont}</Text>
              <View className="flex flex-row flex-wrap gap-2 mt-8">
                <TouchableOpacity
                  onPress={handleCloseModal}
                  className="bg-gray-200 px-4 py-2 rounded-md"
                >
                  <Text className="font-medium text-[#315072]">Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setTimeout(() => setQuestionModalVisible(true), 300);
                  }}
                  className="bg-[#e1f0ff] px-4 py-2 rounded-md"
                >
                  <Text className="font-medium text-[#315072]">Make a Question</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleGetStarted}
                  className="z-70 bg-[#badcff] px-4 py-2 rounded-md pointer"
                >
                  <Text className="font-medium text-[#315072]">Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View className="relative flex-1 justify-center items-center mt-10">
              <Image
                source={selectedService?.images[0]}
                style={{ 
                  width: isDesktop ? 360 : 380, 
                  height: isDesktop ? 260 : 200, 
                  borderRadius: 16 
                }}
                resizeMode="cover"
              />
              <TouchableOpacity
                className="top-1/2 left-1/2 absolute bg-[#badcffab] px-4 py-2 rounded-md -translate-x-1/2 -translate-y-1/2"
                onPress={() => {
                  // Future implementation for seeing more images
                }}
              >
                <Text className="font-medium text-[#315072]">See</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Question Modal */}
      <Modal
        visible={questionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQuestionModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-xs">
            <Text className="mb-4 font-bold text-[#315072] text-lg text-center">
              Make a Question
            </Text>
            <TextInput
              value={questionText}
              onChangeText={setQuestionText}
              placeholder="Write your question here..."
              multiline
              numberOfLines={4}
              className="bg-white mb-3 p-3 border border-[#c9e4ff] rounded-md text-[#315072]"
              textAlignVertical="top"
            />
            {questionSent && (
              <Text className="mb-2 text-green-700 text-center">
                Thanks, we will get back to you soon!
              </Text>
            )}
            <View className="flex flex-row justify-between mt-2">
              <TouchableOpacity
                onPress={() => {
                  setQuestionModalVisible(false);
                  setQuestionText("");
                  setQuestionSent(false);
                }}
                className="bg-gray-200 px-4 py-2 rounded-md"
              >
                <Text className="text-[#315072] text-center">Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSendQuestion}
                disabled={questionText.trim().length < 5 || questionSent}
                className={`px-4 py-2 rounded-md ${
                  questionText.trim().length >= 5 && !questionSent
                    ? "bg-[#badcff]"
                    : "bg-gray-300"
                }`}
              >
                <Text className="font-bold text-[#315072] text-center">Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // Estados para el formulario de nueva pregunta
  const [question, setQuestion] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [contactType, setContactType] = useState<"email" | "phone" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Validación simple
  const isContactValid =
    (contactType === "email" && /\S+@\S+\.\S+/.test(contactInfo)) ||
    (contactType === "phone" && /^[0-9+\-\s()]{7,}$/.test(contactInfo));

  const handleSendQuestion = () => {
    if (question.trim().length < 5) return;
    setShowContactModal(true);
  };

  const handleContactSubmit = () => {
    if (!isContactValid) return;
    // Aquí podrías enviar la pregunta y el contacto a tu backend si lo deseas
    setShowContactModal(false);
    setSubmitted(true);
    setQuestion("");
    setContactInfo("");
    setContactType(null);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <View className="flex lg:flex-row flex-col justify-center items-center bg-[#FFFFFF] mb-40 px-16 lg:px-64 pt-48 lg:pt-0 h-screen">
      {/* Preguntas frecuentes a la izquierda */}
      <View className="w-full lg:w-1/2">
        <Text className="mb-12 font-bold text-[#315072] text-xl lg:text-2xl text-center">
          Frequently Asked Questions
        </Text>
        {faqs.map((faq, idx) => (
          <View key={idx} className="mb-2 border-[#e1f0ff] border-b-2">
            <TouchableOpacity
              onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex flex-row justify-between items-center py-4"
            >
              <Text className="font-medium text-[#315072] text-md lg:text-lg">
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

      {/* Formulario de nueva pregunta a la derecha */}
      <View className="flex flex-col justify-start items-center mt-10 lg:mt-0 lg:pl-10 w-full lg:w-1/2">
        <View className="bg-[#e1f0ff] shadow-md p-6 rounded-xl w-full max-w-md">
          <Text className="mb-2 font-bold text-[#315072] text-lg text-center">
            Make a Question
          </Text>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="Write your question here . . . "
            multiline
            numberOfLines={3}
            className="bg-white mb-3 p-3 border border-[#c9e4ff] rounded-md text-[#315072]"
            textAlignVertical="top"
          />
          <TouchableOpacity
            onPress={handleSendQuestion}
            disabled={question.trim().length < 5}
            className={`w-full px-4 py-2 rounded-md ${
              question.trim().length < 5
                ? "bg-gray-300"
                : "bg-[#badcff] hover:bg-[#e1f0ff]"
            }`}
          >
            <Text className="font-bold text-[#315072] text-center">
              Send
            </Text>
          </TouchableOpacity>
          {submitted && (
            <Text className="mt-4 text-green-700 text-center">
              ¡Gracias! Pronto te daremos respuesta.
            </Text>
          )}
        </View>
      </View>

      {/* Modal para pedir contacto */}
      <Modal
        visible={showContactModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-xs">
            <Text className="mb-4 font-bold text-[#315072] text-lg text-center">
            We can contact you via:
            </Text>
            {/* Correo */}
            <Text className="mb-1 text-[#315072]">Mail</Text>
            <TextInput
              value={contactType === "email" ? contactInfo : ""}
              onChangeText={(text) => {
                setContactType("email");
                setContactInfo(text);
              }}
              placeholder="Your email address"
              keyboardType="email-address"
              className="bg-white mb-2 p-3 border border-[#c9e4ff] rounded-md text-[#315072]"
              autoCapitalize="none"
            />
            {/* Separador */}
            <Text className="my-2 text-[#315072] text-center">O</Text>
            {/* Teléfono */}
            <Text className="mb-1 text-[#315072]">Phone</Text>
            <TextInput
              value={contactType === "phone" ? contactInfo : ""}
              onChangeText={(text) => {
                setContactType("phone");
                setContactInfo(text);
              }}
              placeholder="Your phone number"
              keyboardType="phone-pad"
              className="bg-white mb-4 p-3 border border-[#c9e4ff] rounded-md text-[#315072]"
            />
            {/* Botones */}
            <View className="flex flex-row justify-between mt-2">
              <TouchableOpacity
                onPress={() => setShowContactModal(false)}
                className="bg-gray-200 px-4 py-2 rounded-md"
              >
                <Text className="text-[#315072] text-center">Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleContactSubmit}
                disabled={
                  !(
                    (contactType === "email" && /\S+@\S+\.\S+/.test(contactInfo)) ||
                    (contactType === "phone" && /^[0-9+\-\s()]{7,}$/.test(contactInfo))
                  )
                }
                className={`px-4 py-2 rounded-md ${
                  (contactType === "email" && /\S+@\S+\.\S+/.test(contactInfo)) ||
                  (contactType === "phone" && /^[0-9+\-\s()]{7,}$/.test(contactInfo))
                    ? "bg-[#badcff]"
                    : "bg-gray-300"
                }`}
              >
                <Text className="font-bold text-[#315072] text-center">Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [showContactModal, setShowContactModal] = useState(false);

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
        lastName: formData.lastName || "",
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        state: formData.state || "",
        city: formData.city || "",
        postal: formData.postal || "",
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
    <View className="flex justify-center items-center bg-[#FFFFFF] px-6 w-full">
      {/* Modal SOLO en móvil */}
      {!isDesktop && (
        <Modal
          visible={showContactModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowContactModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white p-6 rounded-xl w-11/12 max-w-xs">
              <Text className="mb-4 font-bold text-[#315072] text-xl text-center">
                Contact Us
              </Text>
              <View className="space-y-4">
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${PHONE_CONTACT}`);
                    setShowContactModal(false);
                  }}
                  className="flex-row items-center gap-3 py-2"
                >
                  <Ionicons name="call" color="#315072" size={28} />
                  <Text className="text-[#315072] text-lg">Phone</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`sms:${PHONE_CONTACT}`);
                    setShowContactModal(false);
                  }}
                  className="flex-row items-center gap-3 py-2"
                >
                  <MaterialIcons name="sms" color="#315072" size={28} />
                  <Text className="text-[#315072] text-lg">Message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`https://wa.me/${WHATSAPP_CONTACT}`);
                    setShowContactModal(false);
                  }}
                  className="flex-row items-center gap-3 py-2"
                >
                  <Ionicons name="logo-whatsapp" color="#315072" size={28} />
                  <Text className="text-[#315072] text-lg">Whatsapp</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => setShowContactModal(false)}
                className="self-center bg-[#FFFFFF] mt-6 px-4 py-2 rounded-md"
              >
                <Text className="font-medium text-[#315072]">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View className="flex lg:flex-row flex-col gap-5 bg-white drop-shadow-xl mx-auto my-20 rounded-xl w-full max-w-6xl">
        {/* Contact Info */}
        <View className="bg-[#e1f0ff] drop-shadow-md px-10 pt-7 rounded-xl w-full lg:w-1/2">
          <Text className="mb-2 lg:mb-6 font-bold text-[#315072] text-2xl md:text-3xl text-left">
            Contact Information
          </Text>
          <Text className="flex text-[#315072] lg:text-lg text-xl lg:text-left text-center">
            Get in touch with us{" "}
            <Text className="hidden lg:flex">
              for any questions or inquiries.
            </Text>
          </Text>
          {/* Mensaje SOLO en móvil */}
          {!isDesktop && (
            <View className="mt-2 mb-4">
              <View>
                <Text>
                  Email us at{" "}
                  <Text
                    className="font-bold text-[#315072] underline"
                    onPress={() => Linking.openURL(`mailto:${MAIL_CONTACT}`)}
                  >
                    {MAIL_CONTACT}
                  </Text>{" "}
                </Text>
                <Text>
                  Or use this number{" "}
                  <Text
                    className="font-bold text-[#315072] underline"
                    onPress={() => setShowContactModal(true)}
                  >
                    {PHONE_CONTACT}
                  </Text>
                </Text>
              </View>
              <Text className="flex flex-col text-[#315072] text-left"></Text>
            </View>
          )}

          {/* Contactos visibles solo en escritorio */}
          {isDesktop && (
            <>
              <View className="flex-row lg:grid lg:grid-cols-2 m-auto mt-0 lg:mt-20 pb-5">
                <View className="flex flex-col items-start lg:gap-15">
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${PHONE_CONTACT}`)}
                    className="flex-row justify-start items-center gap-2 hover:drop-shadow-md lg:pb-5 border-[#ffffff63] border-b-2 w-96"
                  >
                    <Ionicons name="call" color={"#315072"} size={30} />
                    <View className="gap-0 lg:gap-3 p-2">
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
                    <Ionicons name="mail" color={"#315072"} size={30} />
                    <View className="gap-0 lg:gap-3 p-2">
                      <Text className="lg:flex items-center gap-5 font-semibold text-[#315072] lg:text-md text-lg">
                        {MAIL_CONTACT}
                      </Text>
                      <Text>Email us to discuss your project</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex flex-row justify-between gap-10 lg:gap-20 lg:grid lg:grid-cols-2 lg:m-auto mt-0 lg:mt-20 pb-5">
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
            </>
          )}
        </View>

        {/* Form */}
        <View className="flex-1 space-y-1 m-2 px-5 lg:px-0 pr-4 pb-3 min-w-0">
          <View className="flex flex-row justify-between gap-1 lg:pt-5 w-full overflow-hidden">
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
          <View className="flex flex-row gap-4 w-full overflow-hidden">
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
      className="bg-[#e1f0ff] border-[#badcff] border-t"
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
                  onPress={() => scrollToSection?.("services", true)}
                >
                  Services
                </Text>
                <Text
                  className="text-[#315072] text-sm"
                  onPress={() => scrollToSection?.("faq", true)}
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
          <View className="flex flex-row justify-center gap-4 mt-4">
            <TouchableOpacity
              onPress={() => Linking.openURL("https://www.facebook.com/tu-negocio")}
              accessibilityLabel="Facebook"
            >
              <Ionicons name="logo-facebook" size={28} color="#120" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://www.instagram.com/tu-negocio")}
              accessibilityLabel="Instagram"
            >
              <Ionicons name="logo-instagram" size={28} color="#120" />
            </TouchableOpacity>
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
            <Text className="mb-2 text-[#315072] text-2xl">
              {about[modalVisible]?.title}
            </Text>
            <Text className="my-6 text-[#315072] text-lg">
              {about[modalVisible]?.info}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(null)}
              className="self-end bg-[#FFFFFF] hover:bg-[#ffd753] px-4 py-2 rounded-md transition-colors duration-300"
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
    <View className="mb-1 lg:mb-3">
      <Text className="mb-1 font-medium text-[#315072] text-sm lg:text-xl">
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
            ? "border-[#c9e4ff]"
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
      <Text className="mt-4 mb-1 font-medium text-[#315072] text-md lg:text-xl">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={true}
        numberOfLines={3}
        className="bg-white p-2 border border-[#c9e4ff] rounded-md h-24p lg:h-32 text-[#3150727a]"
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
      className={`mt-4 px-6 py-2 lg:py-3 rounded-md ${
        disabled ? "bg-gray-400" : "bg-[#badcff]"
      } hover:bg-[#e1f0ff]`}
    >
      <Text className="font-medium text-[#315072] text-base text-center hover:">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
