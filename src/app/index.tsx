import React, { useRef, useEffect, useState } from "react";
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
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal, Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {
  MAIL_CONTACT,
  PHONE_CONTACT,
  SERVER_URL,
  WHATSAPP_CONTACT,
} from "@env";
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import useScrolled from "@/hooks/useScroll";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const {height: SCREEN_HEIGHT} = Dimensions.get("screen")
const COLORS = {
  blueDark: "#315072",        
  blueDarker: "#293b51",      
  white: "#e9eef5",           
  whiteSoft: "#f4f7fb",       
  border: "#1b2636",          
  error: "#e53e3e",           
  accent: "#709ac0",          
  accentSoft: "#a2bdd7",      
  gray: "#9ca3af",            
  blackOverlay: "rgba(0,0,0,0.4)", 
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
    contact2: useRef<View>(null)
  };
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isLargeScreen = isDesktop || isTablet;
  const { isScrolled, onScroll } = useScrolled();

  const scrollToSection = (sectionName: string, forceScroll = false) => {
    if (isLargeScreen || forceScroll) {
      sectionRefs[sectionName].current?.measureLayout(
        scrollViewRef.current?.getInnerViewNode(),
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y, animated: true });
        },
        () => {
          // Fallback para tablets donde measureLayout puede fallar
          const sectionOrder = ["home", "services", "faq", "contact"];
          const sectionIndex = sectionOrder.indexOf(sectionName);
          const sectionY = sectionIndex * height;
          scrollViewRef.current?.scrollTo({ y: sectionY, animated: true });
        }
      );
    }
  };

  const sections = ["home", "services", "faq"];

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.whiteSoft }}>
      <Header
        sections={sections}
        scrollToSection={scrollToSection}
        isScrolled={isScrolled}
      />
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled={isLargeScreen}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        onScroll={onScroll}
        snapToInterval={isLargeScreen ? height : undefined}
        snapToAlignment="start"
        decelerationRate="fast"
      >
        <View
          ref={sectionRefs.home}
          style={{ height: isLargeScreen ? height : "auto" }}
        >
          <LandingSection scrollToSection={scrollToSection} />
        </View>
        <View
          ref={sectionRefs.services}
          style={{ height: isLargeScreen ? height : "auto" }}
        >
          <ServicesSection scrollToSection={scrollToSection} />
        </View>
        <View
          ref={sectionRefs.faq}
          style={{ height: isLargeScreen ? height : "auto" }}
        >
          <FAQSection scrollToSection={scrollToSection} />
        </View>
        <View
          ref={sectionRefs.contact}
          style={{ height: isLargeScreen ? height : "auto" }}
        >
          <ContactSection />
        </View>
        <View
          ref={sectionRefs.contact2}
          style={{ height: isLargeScreen ? height : "auto" }}
        >
          <ContactSection2 />
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
  isScrolled,
}: {
  sections: string[];
  scrollToSection: (section: string, force?: boolean) => void;
  isScrolled: boolean;
}) {
  const { top } = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1024;

  return (
    <View
      style={{
        paddingTop: top,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent`}
    >
      <BlurView
        intensity={400}
        tint={null}
        style={{
          width: "100%",
        }}
      >
        <View className="flex flex-row justify-between items-center mx-auto px-4 py-2 w-full max-w-7xl h-12">
          {/* Left: Logo */}
          <View className="flex flex-row flex-shrink-0 items-center">
            <TouchableOpacity onPress={() => scrollToSection("home")}>
              <Image
                source={require("../../public/logo.svg")}
                style={{
                  marginTop: 12,
                  width: 158,
                  resizeMode: "contain",
                  opacity: 1,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Center: Sections as Row */}
          <View className="hidden md:flex flex-row flex-1 justify-center items-center gap-4">
            {sections.map((section) => (
              <TouchableOpacity
                key={section}
                onPress={() => scrollToSection(section)}
                className="group relative py-1"
              >
                <Text
                  className={`font-bold text-sm uppercase transition-colors duration-200`}
                  style={{ color: COLORS.blueDark }}
                >
                  {section}
                </Text>
                <View
                  className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300`}
                  style={{
                    backgroundColor: isScrolled
                      ? COLORS.blueDarker
                      : COLORS.blueDark,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Right: Contact Button */}
          <View className="hidden md:flex flex-row flex-shrink-0 items-center">
            {/* Iconos de redes sociales */}
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.facebook.com/tu-negocio")
              }
              accessibilityLabel="Facebook"
            >
              <Ionicons name="logo-facebook" size={26} color={COLORS.blueDark} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.instagram.com/tu-negocio")
              }
              className="ml-3"
              accessibilityLabel="Instagram"
            >
              <Ionicons name="logo-instagram" size={26} color={COLORS.blueDark} />
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-3 py-1.5 rounded-md transition-all duration-300`}
              style={{ backgroundColor: COLORS.blueDark, marginLeft: 12 }}
              onPress={() => scrollToSection("contact")}
            >
              <Text className={`font-bold text-sm`} style={{ color: COLORS.white }}>
                Contact
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mobile Menu Button */}
          <View className="md:hidden flex-shrink-0">
            <TouchableOpacity
              onPress={() => setMenuOpen(!menuOpen)}
              className="-mr-2 p-2"
            >
              <View className="relative w-6 h-6">
                <View
                  className={`absolute w-6 h-0.5 rounded-full transition-all duration-300`}
                  style={{
                    backgroundColor: COLORS.blueDark,
                    transform: menuOpen
                      ? [{ rotate: "45deg" }, { translateY: 12 }]
                      : [],
                    top: menuOpen ? "50%" : 0,
                  }}
                />
                <View
                  className={`absolute w-6 h-0.5 rounded-full transition-all duration-300`}
                  style={{
                    backgroundColor: COLORS.blueDark,
                    opacity: menuOpen ? 0 : 1,
                    top: "50%",
                  }}
                />
                <View
                  className={`absolute w-6 h-0.5 rounded-full transition-all duration-300`}
                  style={{
                    backgroundColor: COLORS.blueDark,
                    transform: menuOpen
                      ? [{ rotate: "-45deg" }, { translateY: 12 }]
                      : [],
                    top: menuOpen ? "50%" : "100%",
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mobile Menu */}
        {menuOpen && (
          <View
            className={`md:hidden h-screen justify-center items-center  px-6 py-4 border-t w-full`}
            style={{
              borderColor: isScrolled ? COLORS.accentSoft : COLORS.white + "33",
            }}
          >
            <View className="max-w-7xl">
              <Text
                className={`mb-4 font-bold text-3xl`}
                style={{ color: COLORS.blueDark }}
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
                  className={`py-3 border-b last:border-0`}
                  style={{ borderColor: COLORS.blueDark }}
                >
                  <Text
                    className={`font-medium text-lg uppercase  text-center`}
                    style={{ color: COLORS.blueDark }}
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
                  className={`w-full px-4 py-3 rounded-md shadow-sm`}
                  style={{ backgroundColor: COLORS.blueDark }}
                >
                  <Text
                    className={`text-sm text-center  font-weight-600`}
                    style={{ color: COLORS.white }}
                  >
                    Contact
                  </Text>
                </TouchableOpacity>
                <View className="flex flex-row justify-center gap-4 mt-4">
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL("https://www.facebook.com/tu-negocio")
                    }
                    accessibilityLabel="Facebook"
                  >
                    <Ionicons
                      name="logo-facebook"
                      size={28}
                      color={COLORS.blueDark}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL("https://www.instagram.com/tu-negocio")
                    }
                    accessibilityLabel="Instagram"
                  >
                    <Ionicons
                      name="logo-instagram"
                      size={28}
                      color={COLORS.blueDark}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </BlurView>
    </View>
  );
}
function LandingSection({
  scrollToSection,
}: {
  scrollToSection: (section: string, force?: boolean) => void;
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 500 && width < 1024;

  return (
    <FadeInView>
      <View className="relative flex flex-1">
        {/* Fondo claro */}
        <View
          className="absolute inset-0 w-full h-full"
          style={{ backgroundColor: COLORS.whiteSoft, zIndex: 0 }}
        />

        {/* Imagen */}
        <Image
          source={"landing.jpg"}
          className="hidden lg:block z-10 absolute w-full h-screen cover"
        />
        <Image
        source={"landingCell.jpg"}
        className="lg:hidden block z-10 absolute w-full h-screen cover"
        />
        {/* Contenido */}
        <View className="z-20 flex flex-1 justify-center items-center w-full h-screen">
          <View className="flex lg:flex-row flex-col justify-between lg:items-center px-10 lg:px-32 max-w-full h-screen">
            <View className="flex flex-col justify-start lg:justify-center items-center lg:pb-24 w-full h-full" style={{paddingTop: isDesktop ? 0 : isTablet ? SCREEN_WIDTH * .25 : SCREEN_WIDTH * .30}}>
              <View className="flex justify-center items-center w-full">
                <Image
                  source={"logo-navy.png"}
                  style={{
                    width: SCREEN_WIDTH * .9,
                    height: isDesktop ? SCREEN_WIDTH * .15 : isTablet ? SCREEN_WIDTH * .25 : SCREEN_WIDTH * .42,
                    resizeMode: "contain",
                  }}
                  resizeMode="contain"
                />
              </View>
              <View className="flex flex-col justify-center items-center gap-2">
                <Text
                  className="justify-center items-center lg:mt-5 mb-1 lg:p-0 md:py-4 font-semibold text-center"
                  style={{ color: COLORS.blueDark, fontSize: isDesktop ? 22 : SCREEN_WIDTH * .038}}

                >
                  Our goal is to help you develop your property. We work with
                  passion to meet the expectations of home owners and
                  developers.
                </Text>
                <View className="flex flex-row justify-center items-center gap-4 w-full">
                  <TouchableOpacity
                    onPress={() => scrollToSection("services", true)}
                    style={{
                      borderRadius: 6,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.blueDarker,
                        fontWeight: "600",
                        fontSize: 16,
                        textAlign: "center",
                      }}
                    >
                      More Information
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => scrollToSection("contact")}
                    style={{
                      backgroundColor: COLORS.blueDark,
                      borderRadius: 6,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontWeight: "600",
                        fontSize: 16,
                        textAlign: "center",
                      }}
                    >
                      Get Started →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </FadeInView>
  );
}
function ServicesSection({
  scrollToSection,
}: {
  scrollToSection?: (section: string, force?: boolean) => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionSent, setQuestionSent] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const services = [
    {
      title: "Let's build an ADU",
      description:
        "Turn your available space into a source of value with an Accessory Dwelling Unit (ADU).",
      cont: "Turn your available space into a source of value with an Accessory Dwelling Unit (ADU). Our ADU construction service allows you to make the most of your property, whether to generate rental income, comfortably house family members, or expand your living space. We design functional and efficient solutions that comply with local regulations, optimizing energy and materials for a sustainable home. With a smart investment, an ADU can offer you financial independence and flexibility, adapting to your current and future needs.",
      images: [
        require("../../assets/Images Renderizadas/ADU/SharedScreenshot 2.webp"),
        require("../../assets/Images Renderizadas/ADU/SharedScreenshot 4.webp"),
        require("../../assets/Images Renderizadas/ADU/SharedScreenshot 5.webp"),
        require("../../assets/Images Renderizadas/ADU/SharedScreenshot 6.webp"),
      ],
    },
    {
      title: "Home Remodeling and Addition",
      description:
        "Transform your home to better suit your lifestyle and family needs.",
      cont: "Our home remodeling and expansion services are designed to optimize your existing floor plan, creating more functional, comfortable and efficient spaces. Whether it's redistributing key areas, expanding bedrooms or modernizing bathrooms, we help you make the most of every square foot in a strategic way. With intelligent design and construction solutions, we turn your home into an environment that flows naturally and enhances your well-being.",
      images: [
        require("../../assets/Images Renderizadas/HOME_REMODELATION_&_ADITION/236c150e96ab40ff7d55eff89e1df194.webp"),
        require("../../assets/Images Renderizadas/HOME_REMODELATION_&_ADITION/34cd3b4d95b8540cb0597dfd8fb3d8e3.webp"),
        require("../../assets/Images Renderizadas/HOME_REMODELATION_&_ADITION/6e9fca23ae57f21396afc52fc8726640.webp"),
        require("../../assets/Images Renderizadas/HOME_REMODELATION_&_ADITION/ae309748a132f76fb5867568bd3634e2.webp"),
      ],
    },
    {
      title: "Inspiring Backyard Spaces",
      description:
        "Turn your backyard into an oasis designed for comfort and conviviality.",
      cont: "Our outdoor transformation service creates living areas with elegant pergolas, fire pits for warm moments, grills for unforgettable gatherings and a perfect balance of concrete pavers and natural grass. Cozy lighting enhances every detail, creating an ideal environment for relaxing, sharing and making the most of your home. Our architects and designers will turn your patio into a dream space for the whole family.",
      images: [
        require("../../assets/Images Renderizadas/BACKYARD/171bab5615fb26781618d8ac56311a9a.webp"),
        require("../../assets/Images Renderizadas/BACKYARD/245919b9596c7627920f325e3e8c5f24.webp"),
        require("../../assets/Images Renderizadas/BACKYARD/5434cb30b1bd49b25804aa09ec663bb4.webp"),
        require("../../assets/Images Renderizadas/BACKYARD/5f603e2078dde9f7128814905cdd475e.webp"),
      ],
    },
    {
      title: "General Construction and Repair",
      description:
        "We offer comprehensive solutions for construction, maintenance, painting, and repairs.",
      cont: "We offer comprehensive solutions for construction, maintenance, painting, repair of roofs, walls, floors and any damaged area of the building. Whether you need to develop a project from scratch or restore existing structures, our team is ready to deliver quality results. From structural improvements to detailed renovations, we provide reliable service tailored to your needs.",
      images: [
        require("../../assets/Images Renderizadas/GENERAL REPAIR/15640787a9376f5b01b69b5c345656da.webp"),
        require("../../assets/Images Renderizadas/GENERAL REPAIR/3023072130a24ef92245c6c0d2c1912a.webp"),
        require("../../assets/Images Renderizadas/GENERAL REPAIR/336e449cfaf9c5466a48be08281f1354.webp"),
        require("../../assets/Images Renderizadas/GENERAL REPAIR/3b753451a02912f70be1662b94bedaab.webp"),
      ],
    },
    {
      title: "Financial Support",
      description:
        "We help you access the financial resources available to develop construction and renovation projects.",
      cont: "Through credit options or structured loans, homeowners can invest in an Auxiliary Dwelling Unit (ADU) or improve their home, distributing the payment in affordable installments. This service provides financial flexibility, facilitating the materialization of projects without compromising economic stability.",
      images: [
        require("../../assets/Images Renderizadas/FINANCING/71j10cyRf8L._SL1360_.webp"),
        require("../../assets/Images Renderizadas/FINANCING/adu-financing-in-california-all-available-options.webp"),
        require("../../assets/Images Renderizadas/FINANCING/SharedScreenshot (1).webp"),
      ],
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
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedService.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedService.images.length - 1 : prev - 1
    );
  };

  const openModalWithService = (service: any) => {
    setSelectedService(service);
    setCurrentImageIndex(0);
    setModalVisible(true);
  };

  return (
    <View
      className="flex flex-col justify-center items-center py-5 pt-12 md:w-full md:h-screen"
      style={{ backgroundColor: COLORS.white }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-auto w-full max-w-6xl">
          <Text
            className="mb-3 font-bold text-3xl md:text-4xl text-center"
            style={{ color: COLORS.blueDark }}
          >
            Our Services
          </Text>
          <Text
            className="mb-10 px-4 font-extralight text-lg md:text-xl text-center"
            style={{ color: COLORS.blueDark, fontFamily: "Arial" }}
          >
            We offer a wide range of services to meet your needs.
          </Text>
          <View className="gap-4 lg:gap-5 grid grid-cols-1 md:grid-cols-3 px-5">
            {services.map((service, index) => (
              <Pressable
                onPress={() => openModalWithService(service)}
                key={index}
                className="flex flex-col justify-between mb-2 p-3 border rounded-xl transition-shadow duration-300"
                style={{
                  backgroundColor: COLORS.blueDark,
                  borderColor: COLORS.border,
                }}
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
                <Text
                  className="mb-1 lg:mb-2 font-semibold text-xl"
                  style={{ color: COLORS.white }}
                >
                  {service.title}
                </Text>
                <Text style={{ color: COLORS.white }}>
                  {service.description}
                </Text>
                <Text
                  className="mt-4 font-medium transition-colors duration-300"
                  style={{ color: COLORS.whiteSoft }}
                >
                  Read More →
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Service Modal with Carousel */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View className="flex-col-reverse flex-1 justify-center items-center gap-2"
          style={{ backgroundColor: COLORS.blackOverlay }}>
          <View className="relative lg:flex-row flex-col-reverse justify-center gap-5"
            style={{ backgroundColor: COLORS.white, marginHorizontal: 8, padding: 20, borderRadius: 16, maxWidth: 900 }}>
            <TouchableOpacity
              onPress={handleCloseModal}
              className="top-4 right-4 z-10 absolute justify-center items-center p-2 rounded-full"
            >
              <Ionicons name="close" size={28} color={COLORS.blueDark} />
            </TouchableOpacity>

            <View className="flex-col flex-1 justify-center gap-2 mb-0 pr-0 lg:pr-6 pb-3 min-w-0 max-w-full">
              <Text className="hidden lg:block font-bold text-2xl"
                style={{ color: COLORS.blueDark }}>
                {selectedService?.title}
              </Text>
              <Text className="my-0 pt-8 lg:pt-0 lg:text-md text-xs"
                style={{ color: COLORS.blueDark }}>
                {selectedService?.cont}
              </Text>
              <View className="flex flex-row flex-wrap justify-end items-end gap-2 pt-2 w-full">
                
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setTimeout(() => setQuestionModalVisible(true), 300);
                  }}
                  style={{
                    borderColor: COLORS.border,
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: COLORS.blueDark, fontWeight: "500" }}>
                    Make a Question
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleGetStarted}
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor:COLORS.blueDark,
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: COLORS.whiteSoft, fontWeight: "500" }}>
                    Get Started
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="relative flex-1 pt-3">
              <View className="lg:hidden top-0 right-0 left-0 z-10 my-2 rounded-t-xl">
                {services.map((service, index) => {
                  if (service.title === selectedService?.title) {
                    return (
                      <View key={index} className="w-full h-full">
                        <Text className="font-bold text-2xl"
                          style={{ color: COLORS.blueDark }}>
                          {service.title}
                        </Text>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
              {/* Carousel */}
              <View className="justify-center items-center w-full h-full">
                <Image
                  source={selectedService?.images[currentImageIndex]}
                  style={{
                    width: isDesktop ? 300 : isTablet ? 420 : 280,
                    height: isDesktop ? 260 : isTablet ? 220 : 160,
                    marginTop: isTablet ? 15 : 0,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                  className="shadow-lg mt-10 lg:mt-0 mb-2"
                />

                {/* Navigation Arrows */}
                <TouchableOpacity
                  onPress={handlePrevImage}
                  className="top-1/2 left-0 absolute p-1 rounded-full -translate-y-1/2"
                >
                  <Ionicons name="chevron-back" size={24} color={COLORS.blueDark} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNextImage}
                  className="top-1/2 right-0 absolute p-1 rounded-full -translate-y-1/2"
                >
                  <Ionicons name="chevron-forward" size={24} color={COLORS.blueDark} />
                </TouchableOpacity>

                {/* Indicators */}
                <View className="flex-row justify-center mt-2">
                  {selectedService?.images.map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setCurrentImageIndex(index)}
                    >
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          marginHorizontal: 2,
                          borderRadius: 4,
                          backgroundColor:
                            index === currentImageIndex
                              ? COLORS.blueDark
                              : COLORS.gray,
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Image Counter */}
                <View style={{
                  position: "absolute",
                  right: 8,
                  bottom: 8,
                  backgroundColor: COLORS.blackOverlay,
                  paddingHorizontal: 8,
                  borderRadius: 6,
                }}>
                  <Text style={{ color: COLORS.white, fontSize: 12 }}>
                    {currentImageIndex + 1}/{selectedService?.images.length}
                  </Text>
                </View>
              </View>
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
        <View className="flex-1 justify-center items-center"
          style={{ backgroundColor: COLORS.blackOverlay }}>
          <View style={{
            backgroundColor: COLORS.white,
            padding: 24,
            borderRadius: 16,
            width: "90%",
            maxWidth: 400,
          }}>
            <Text style={{
              marginBottom: 16,
              fontWeight: "bold",
              color: COLORS.blueDark,
              fontSize: 18,
              textAlign: "center",
            }}>
              Make a Question
            </Text>
            <TextInput
              value={questionText}
              onChangeText={setQuestionText}
              placeholder="Write your question here..."
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: COLORS.white,
                marginBottom: 12,
                padding: 12,
                borderColor: COLORS.accent,
                borderWidth: 1,
                borderRadius: 8,
                color: COLORS.blueDark,
                textAlignVertical: "top",
              }}
            />
            {questionSent && (
              <Text style={{
                marginBottom: 8,
                color: "green",
                textAlign: "center",
              }}>
                Thanks, we will get back to you soon!
              </Text>
            )}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  setQuestionModalVisible(false);
                  setQuestionText("");
                  setQuestionSent(false);
                }}
                style={{
                  backgroundColor: COLORS.accentSoft,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: COLORS.blueDark, textAlign: "center" }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSendQuestion}
                disabled={questionText.trim().length < 5 || questionSent}
                style={{
                  backgroundColor:
                    questionText.trim().length >= 5 && !questionSent
                      ? COLORS.accent
                      : COLORS.gray,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}
              >
                <Text style={{ fontWeight: "bold", color: COLORS.blueDark, textAlign: "center" }}>
                  Send
                </Text>
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
      question: "What services does DwellingPlus offer?",
      answer:
        "We provide a full range of construction and remodeling services, specializing in Accessory Dwelling Units (ADUs), interior renovations, improvements to outdoor areas and home repairs. Our services include:\n" +
        " - Lot analysis to assess feasibility\n" +
        " - Sketch proposals and renders for design concepts\n" +
        " - Architectural plans\n" +
        " - City permit management\n" +
        " - Construction and project management\n" +
        " - Financing solutions for your project",
    },
    {
      question: "What is an ADU, and how can it benefit my property?",
      answer:
        "An Accessory Dwelling Unit (ADU) is a separate, independent living space located on the same lot as a primary residence. ADUs come in various forms, including detached units, garage conversions, and interior modifications like basement apartments. They provide numerous benefits, such as increasing property value, generating rental income, and creating a private space for family members or guests. Additionally, ADUs contribute to housing solutions in urban areas by maximizing land use efficiently. Many homeowners also find that building an ADU helps them adapt to changing family needs, such as accommodating aging parents or young adults looking for affordable housing.",
    },
    {
      question: "What are the requirements to build an ADU on my lot? ",
      answer:
        "ADU regulations vary by city and county, but there are common requirements that homeowners must consider. These include zoning laws, minimum and maximum unit size, setback distances from property lines, and utility connections for water, electricity, and sewage. In California, state laws have made ADU construction more accessible, reducing restrictions on parking and allowing homeowners to build units even in single-family zones. Some factors that may influence approval include available space, historical preservation restrictions, and neighborhood density. At DWELLING PLUS, we take care of analyzing all these aspects to ensure compliance, simplifying the process for homeowners.",
    },
    {
      question: "How does the permit process work?",
      answer:
        "The permit process involves several stages, including site evaluation, architectural planning, engineering reviews, and city approvals. First, we assess your lot to determine feasibility based on zoning laws and building codes. Then, our team prepares sketches and detailed construction plans that align with your vision while meeting regulatory requirements. Once the plans are finalized, we submit them to the city for review. This phase may include corrections or clarifications requested by city officials. After approval, we secure the necessary construction permits, ensuring a smooth transition into the building phase. Our team handles every step, reducing stress and keeping you informed throughout the process.",
    },
    {
      question: "Do you offer financing for construction and remodeling?",
      answer:
        "Yes, DWELLING PLUS assists homeowners in finding financing options that suit their needs. Building an ADU or renovating a home can be a significant investment, but there are various financial solutions available. These include home equity loans, construction loans, government grants, and specialized ADU financing programs. Some cities offer incentives for ADU construction, such as reduced fees or streamlined approval processes. We provide guidance on navigating the financing landscape, helping you identify the best way to fund your project while considering long-term benefits like rental income or increased property value.",
    },
    {
      question: "How long does a remodel or new construction take?",
      answer:
        "The timeline for construction depends on the project's complexity and scope. A full ADU construction typically takes 4 to 6 months, from design to completion, depending on permitting delays, material availability, and site conditions. Interior remodels or backyard enhancements may take less time, usually between a few weeks to several months. At DWELLING PLUS, we prioritize efficiency without compromising quality. We establish realistic timelines and keep clients informed about progress, ensuring expectations are met. Our streamlined processes and experienced team help minimize delays while delivering high-quality results.",
    },
    {
      question: "What types of designs and visualizations do you provide?",
      answer:
        "Before construction begins, we provide clients with comprehensive visualizations to help them make informed decisions. This includes conceptual sketches, 2D architectural plans, and detailed 3D renders that showcase how the final structure will look. We also offer virtual walkthroughs, allowing homeowners to 'step inside' their future space through digital simulations. These tools help clients explore different layouts, materials, and aesthetics before committing to a design. Visualization is a crucial part of our process, ensuring that expectations align with reality while eliminating costly design changes later in construction.",
    },
    {
      question: "Can you help me maximize my property's value?",
      answer:
        "Absolutely! Our team specializes in identifying strategic improvements that enhance functionality and aesthetics while increasing property value. Whether through ADU construction, backyard transformations, or interior renovations, we provide expert recommendations tailored to your lot’s potential. Rental income is a key factor in boosting return on investment, and we guide homeowners on designing ADUs that attract tenants. Additionally, we consider long-term trends, energy efficiency, and modern materials to future-proof homes. Our goal is to ensure that every project serves both immediate needs and long-term financial benefits.",
    },
    {
      question: "How do you ensure transparency and speed in construction?",
      answer:
        "We believe that construction should be a stress-free process. Our approach combines clear communication, structured timelines, and efficient project management to minimize disruptions. From the initial consultation to the final build, we provide homeowners with regular updates, detailed cost breakdowns, and realistic completion schedules. Transparency is key—we ensure that every step is clearly outlined, so clients understand what to expect. Additionally, our established relationships with suppliers and city authorities allow us to accelerate permitting and sourcing, ensuring that projects move forward smoothly.",
    },
    {
      question: "What kinds of backyard projects do you build?",
      answer:
        "We specialize in creating beautiful, functional outdoor spaces that enhance the homeowner’s quality of life. Our backyard projects include customized patios, pergolas, outdoor kitchens, fire pits, and landscaping features that maximize enjoyment and usability. We also design recreational areas for families, such as play zones, seating arrangements, and shaded spaces. Whether homeowners seek a relaxing retreat, a stylish entertainment area, or an outdoor workspace, we tailor backyard designs to match individual lifestyles and property layouts.",
    },
    {
      question: "How do I get started with DWELLING PLUS?",
      answer:
        "Getting started is simple! Contact us for a personalized consultation where we assess your property, discuss your vision, and present initial design concepts. Once a project direction is chosen, we handle everything—from detailed planning and city permits to construction and final inspections. Our goal is to streamline the process, ensuring a hassle-free experience while delivering high-quality results. Whether you're interested in building an ADU, renovating your home, or enhancing your backyard, DWELLING PLUS is ready to bring your ideas to life.",
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [contactType, setContactType] = useState<"email" | "phone" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  const isContactValid =
    (contactType === "email" && /\S+@\S+\.\S+/.test(contactInfo)) ||
    (contactType === "phone" && /^[0-9+\-\s()]{7,}$/.test(contactInfo));

  const handleSendQuestion = () => {
    if (question.trim().length < 5) return;
    setShowContactModal(true);
  };

  const handleContactSubmit = () => {
    if (!isContactValid) return;
    setShowContactModal(false);
    setSubmitted(true);
    setQuestion("");
    setContactInfo("");
    setContactType(null);
    setTimeout(() => setSubmitted(false), 4000);
  };

  // Divide las preguntas en 2 columnas
  const colLength = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, colLength), faqs.slice(colLength)];

  return (
    <View
      className="flex flex-col justify-center items-center gap-2 px-2 pt-22 w-full lg:h-screen"
      style={{ backgroundColor: COLORS.whiteSoft, paddingTop: 26 }}
    >
      {/* Título centrado */}
      <Text
        className="pb-5 font-bold text-2xl lg:text-3xl text-center"
        style={{ color: COLORS.blueDark }}
      >
        Frequently Asked Questions
      </Text>
      {/* Preguntas y respuesta */}
      <View
        className={`
          flex flex-row justify-center items-start mb-10 w-full px-4
          ${
            isMobile
              ? "gap-4 max-w-xl"
              : isTablet
              ? "gap-6 max-w-4xl"
              : "gap-8 max-w-6xl"
          }
        `}
      >
        {/* Columna de preguntas */}
        <View
          className={`lg:flex-col flex-row flex-1 ${
            isMobile ? "gap-2" : "gap-4"
          }`}
        >
          {columns.map((faqsCol, colIdx) => (
            <View key={colIdx} className="flex-1">
              {faqsCol.map((faq, idx) => {
                const realIdx = colIdx * colLength + idx;
                return (
                  <TouchableOpacity
                    key={realIdx}
                    onPress={() => {
                      setSelectedIndex(realIdx);
                      if (isMobile) setShowAnswerModal(true);
                    }}
                    className="mb-2 px-3 py-3 border rounded-xl transition-all"
                    style={{
                      borderColor:
                        selectedIndex === realIdx && !isMobile
                          ? COLORS.accent
                          : COLORS.accentSoft,
                      backgroundColor:
                        selectedIndex === realIdx && !isMobile
                          ? COLORS.accent
                          : COLORS.whiteSoft,
                      shadowColor: COLORS.gray,
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                    }}
                  >
                    <Text
                      className="font-semibold text-base"
                      style={{ color: COLORS.blueDark }}
                    >
                      {faq.question}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
        {/* Respuesta solo en tablet/desktop */}
        {!isMobile && (
          <View
            className={`flex-1 shadow-sm p-4 lg:p-6 border rounded-xl max-w-xl min-h-[220px] ${
              isTablet ? "ml-4" : "ml-8"
            }`}
            style={{
              backgroundColor: COLORS.whiteSoft,
              borderColor: COLORS.accentSoft,
            }}
          >
            <Text
              className="mb-2 font-bold text-lg"
              style={{ color: COLORS.blueDark }}
            >
              {faqs[selectedIndex].question}
            </Text>
            <Text
              className="text-base whitespace-pre-line"
              style={{ color: COLORS.blueDark }}
            >
              {faqs[selectedIndex].answer}
            </Text>
            <View className="mt-10 pb-6 rounded-xl w-full">
              <Text
                className="mb-2 font-bold text-lg text-center"
                style={{ color: COLORS.blueDark }}
              >
                Make a Question
              </Text>
              <TextInput
                value={question}
                onChangeText={setQuestion}
                placeholder="Write your question here . . . "
                multiline
                numberOfLines={3}
                className="mb-3 p-3 rounded-md"
                style={{
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.accent,
                  borderWidth: 1,
                  color: COLORS.blueDark,
                }}
                textAlignVertical="top"
                placeholderTextColor={COLORS.gray}
              />
              <TouchableOpacity
                onPress={handleSendQuestion}
                disabled={question.trim().length < 5}
                className="px-4 py-2 rounded-md w-full"
                style={{
                  backgroundColor:
                    question.trim().length < 5
                      ? COLORS.accentSoft
                      : COLORS.accent,
                }}
              >
                <Text
                  className="font-bold text-center"
                  style={{ color: COLORS.blueDark }}
                >
                  Send
                </Text>
              </TouchableOpacity>
              {submitted && (
                <Text
                  className="mt-4 text-center"
                  style={{ color: "green" }}
                >
                  ¡Gracias! Pronto te daremos respuesta.
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
      {/* Modal de respuesta en móvil */}
      <Modal
        visible={showAnswerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAnswerModal(false)}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: COLORS.blackOverlay }}
        >
          <View
            className="relative p-6 rounded-xl w-11/12 max-w-md"
            style={{ backgroundColor: COLORS.white }}
          >
            <TouchableOpacity
              onPress={() => setShowAnswerModal(false)}
              className="top-3 right-3 z-10 absolute"
            >
              <Ionicons name="close" size={28} color={COLORS.blueDark} />
            </TouchableOpacity>
            <Text
              className="mb-4 font-bold text-lg"
              style={{ color: COLORS.blueDark }}
            >
              {faqs[selectedIndex].question}
            </Text>
            <Text
              className="text-base whitespace-pre-line"
              style={{ color: COLORS.blueDark }}
            >
              {faqs[selectedIndex].answer}
            </Text>
          </View>
        </View>
      </Modal>
      {/* Modal para pedir contacto */}
      <Modal
        visible={showContactModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: COLORS.blackOverlay }}
        >
          <View
            className="p-6 rounded-xl w-11/12 max-w-xs"
            style={{ backgroundColor: COLORS.white }}
          >
            <Text
              className="mb-4 font-bold text-lg text-center"
              style={{ color: COLORS.blueDark }}
            >
              Give us a way to contact you
            </Text>
            {/* Correo */}
            <Text className="mb-1" style={{ color: COLORS.blueDark }}>
              Mail
            </Text>
            <TextInput
              value={contactType === "email" ? contactInfo : ""}
              onChangeText={(text) => {
                setContactType("email");
                setContactInfo(text);
              }}
              placeholder="Your email address"
              keyboardType="email-address"
              className="mb-2 p-3 rounded-md"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.accent,
                borderWidth: 1,
                color: COLORS.blueDark,
              }}
              autoCapitalize="none"
              placeholderTextColor={COLORS.gray}
            />
            {/* Teléfono */}
            <Text className="mb-1" style={{ color: COLORS.blueDark }}>
              Phone
            </Text>
            <TextInput
              value={contactType === "phone" ? contactInfo : ""}
              onChangeText={(text) => {
                setContactType("phone");
                setContactInfo(text);
              }}
              placeholder="Your phone number"
              keyboardType="phone-pad"
              className="mb-4 p-3 rounded-md"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.accent,
                borderWidth: 1,
                color: COLORS.blueDark,
              }}
              placeholderTextColor={COLORS.gray}
            />
            {/* Botones */}
            <View className="flex flex-row justify-between mt-2">
              <TouchableOpacity
                onPress={() => setShowContactModal(false)}
                style={{
                  backgroundColor: COLORS.accentSoft,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: COLORS.blueDark, textAlign: "center" }}>
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleContactSubmit}
                disabled={!isContactValid}
                style={{
                  backgroundColor: isContactValid
                    ? COLORS.accent
                    : COLORS.gray,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}
              >
                <Text
                  className="font-bold text-center"
                  style={{ color: COLORS.blueDark }}
                >
                  Send
                </Text>
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
  const [searchDebounce, setSearchDebounce] = useState<any>();
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
    <View
      className="flex justify-center items-center px-6 w-full h-screen"
      style={{ backgroundColor: COLORS.whiteSoft }}
    >
      {/* Modal SOLO en móvil */}
      {!isDesktop && (
        <Modal
          visible={showContactModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowContactModal(false)}
        >
          <View
            className="flex-1 justify-center items-center"
            style={{ backgroundColor: COLORS.blackOverlay }}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 24,
                borderRadius: 16,
                width: "90%",
                maxWidth: 400,
              }}
            >
              <Text
                style={{
                  marginBottom: 16,
                  fontWeight: "bold",
                  color: COLORS.blueDark,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Contact Us
              </Text>
              <View style={{ gap: 16 }}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${PHONE_CONTACT}`);
                    setShowContactModal(false);
                  }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 }}
                >
                  <Ionicons name="call" color={COLORS.blueDark} size={28} />
                  <Text style={{ color: COLORS.blueDark, fontSize: 18 }}>Phone</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`sms:${PHONE_CONTACT}`);
                    setShowContactModal(false);
                  }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 }}
                >
                  <MaterialIcons name="sms" color={COLORS.blueDark} size={28} />
                  <Text style={{ color: COLORS.blueDark, fontSize: 18 }}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`https://wa.me/${WHATSAPP_CONTACT}`);
                    setShowContactModal(false);
                  }}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 }}
                >
                  <Ionicons name="logo-whatsapp" color={COLORS.blueDark} size={28} />
                  <Text style={{ color: COLORS.blueDark, fontSize: 18 }}>Whatsapp</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => setShowContactModal(false)}
                style={{
                  alignSelf: "center",
                  backgroundColor: COLORS.white,
                  marginTop: 24,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: COLORS.blueDark, fontWeight: "500" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View className="flex lg:flex-row flex-col gap-5 drop-shadow-xl mx-auto my-20 rounded-xl w-full max-w-6xl"
        style={{ backgroundColor: COLORS.white }}>
        {/* Contact Info */}
        <View
          style={{
            backgroundColor: COLORS.blueDark,
            paddingHorizontal: 40,
            paddingTop: 28,
            borderRadius: 16,
            width: "100%",
            maxWidth: isDesktop ? "50%" : "100%",
          }}
        >
          <Text
            style={{
              marginBottom: isDesktop ? 24 : 8,
              fontWeight: "bold",
              color: COLORS.white,
              fontSize: 28,
              textAlign: "left",
            }}
          >
            Contact Information
          </Text>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 18,
              textAlign: isDesktop ? "left" : "center",
              marginBottom: isDesktop ? 0 : 12,
            }}
          >
            Get in touch with us{" "}
            {isDesktop && (
              <Text>
                for any questions or inquiries.
              </Text>
            )}
          </Text>
          {/* Mensaje SOLO en móvil */}
          {!isDesktop && (
            <View style={{ marginTop: 8, marginBottom: 16 }}>
              <Text style={{color: COLORS.whiteSoft }}>
                Email us at{" "}
                <Text
                  style={{ fontWeight: "bold", color: COLORS.whiteSoft, textDecorationLine: "underline" }}
                  onPress={() => Linking.openURL(`mailto:${MAIL_CONTACT}`)}
                >
                  {MAIL_CONTACT}
                </Text>{" "}
              </Text>
              <Text style={{color: COLORS.whiteSoft }}>
                Or use this number{" "}
                <Text
                  style={{ fontWeight: "bold", color: COLORS.whiteSoft, textDecorationLine: "underline" }}
                  onPress={() => setShowContactModal(true)}
                >
                  {PHONE_CONTACT}
                </Text>
              </Text>
            </View>
          )}

          {/* Contactos visibles solo en escritorio */}
          {isDesktop && (
            <>
              <View style={{ flexDirection: "row", marginTop: 32, paddingBottom: 20 }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${PHONE_CONTACT}`)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderBottomWidth: 2,
                      borderBottomColor: COLORS.white + "63",
                      paddingBottom: 12,
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons name="call" color={COLORS.white} size={30} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={{ fontWeight: "bold", color: COLORS.white, fontSize: 18 }}>
                        {PHONE_CONTACT}
                      </Text>
                      <Text style={{ color: COLORS.white }}>
                        Call now for a free consultation
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`mailto:${MAIL_CONTACT}`)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="mail" color={COLORS.white} size={30} />
                    <View style={{ marginLeft: 12 }}>
                      <Text style={{ fontWeight: "bold", color: COLORS.white, fontSize: 18 }}>
                        {MAIL_CONTACT}
                      </Text>
                      <Text style={{ color: COLORS.white }}>
                        Email us to discuss your project
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20, paddingBottom: 20 }}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`sms:${PHONE_CONTACT}`)}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <MaterialIcons
                    name="sms"
                    color={COLORS.blueDark}
                    size={40}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`https://wa.me/${WHATSAPP_CONTACT}`)
                  }
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Ionicons
                    name="logo-whatsapp"
                    color={COLORS.blueDark}
                    size={40}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Formulario */}
        <View className="flex-1 space-y-1 m-2 px-5 pr-4 lg:pr-4 pb-3 min-w-0">
          <View className="flex flex-row justify-between gap-1 lg:pt-5 w-full overflow-hidden">
            <View style={{ flex: 1 }}>
              <InputField
                label="First Name"
                autoComplete="name"
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="First Name"
                error={errors.name}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
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
            <View style={{ flex: 1 }}>
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
            <View style={{ flex: 1, marginLeft: 8 }}>
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
              <View
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.gray,
                  borderWidth: 1,
                  borderRadius: 8,
                  zIndex: 10,
                }}
              >
                {addressSuggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleAddressSelect(item)}
                    style={{
                      padding: 12,
                      borderBottomColor: COLORS.gray,
                      borderBottomWidth:
                        index !== addressSuggestions.length - 1 ? 1 : 0,
                    }}
                  >
                    <Text style={{ color: COLORS.blueDark }}>{item.display}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Campos autocompletados (ciudad, estado, código postal) */}
          <View className="flex flex-row gap-4 w-full overflow-hidden">
            <View style={{ flex: 1 }}>
              <InputField
                label="City"
                value={formData.city}
                onChangeText={(text) => handleChange("city", text)}
                placeholder="City"
              />
            </View>
            <View style={{ flex: 1 }}>
              <InputField
                label="State"
                value={formData.state}
                onChangeText={(text) => handleChange("state", text)}
                placeholder="State"
              />
            </View>
            <View style={{ flex: 1 }}>
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
      style={{
        backgroundColor: COLORS.accentSoft,
        borderTopWidth: 1,
        borderColor: COLORS.accent,
        paddingBottom: bottom,
      }}
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
            <Text style={{ marginTop: 8, color: COLORS.blueDark, fontSize: 14 }}>
              DwellingPlus © {new Date().getFullYear()} All rights reserved.
            </Text>
            <Text style={{ marginTop: 4, color: COLORS.blueDark, fontSize: 12 }}>
              Map data © OpenStreetMap contributors
            </Text>
            <Text
              style={{
                color: COLORS.blueDark,
                fontSize: 12,
                textDecorationLine: "underline",
                marginTop: 2,
              }}
              onPress={() =>
                Linking.openURL("https://www.vecteezy.com/free-photos/mobile-homes")
              }
            >
              Mobile Homes Stock photos by Vecteezy
            </Text>
          </View>

          <View className="gap-8 grid grid-cols-2">
            <View className="space-y-2">
              <Text style={{ fontWeight: "bold", color: COLORS.blueDark, fontSize: 14 }}>
                Content
              </Text>
              <View className="space-y-1">
                <Text
                  style={{ color: COLORS.blueDark, fontSize: 14 }}
                  onPress={() => scrollToSection?.("services", true)}
                >
                  Services
                </Text>
                <Text
                  style={{ color: COLORS.blueDark, fontSize: 14 }}
                  onPress={() => scrollToSection?.("faq", true)}
                >
                  FAQs
                </Text>
              </View>
            </View>

            <View className="space-y-2">
              <Text style={{ fontWeight: "bold", color: COLORS.blueDark, fontSize: 14 }}>
                Company
              </Text>
              <View className="space-y-1">
                <Text
                  style={{ color: COLORS.blueDark, fontSize: 14 }}
                  onPress={() => setModalVisible("dwelling")}
                >
                  About
                </Text>
                <Text
                  style={{ color: COLORS.blueDark, fontSize: 14 }}
                  onPress={() => setModalVisible("fortuneCode")}
                >
                  Development
                </Text>
              </View>
            </View>
          </View>
          <View className="flex flex-row justify-center gap-4 mt-4">
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.facebook.com/tu-negocio")
              }
              accessibilityLabel="Facebook"
            >
              <Ionicons name="logo-facebook" size={28} color={COLORS.blueDark} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.instagram.com/tu-negocio")
              }
              accessibilityLabel="Instagram"
            >
              <Ionicons name="logo-instagram" size={28} color={COLORS.blueDark} />
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
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: COLORS.blackOverlay }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 24,
              borderRadius: 16,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <Text style={{ marginBottom: 8, color: COLORS.blueDark, fontSize: 22 }}>
              {about[modalVisible]?.title}
            </Text>
            <Text style={{ marginBottom: 24, color: COLORS.blueDark, fontSize: 16 }}>
              {about[modalVisible]?.info}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(null)}
              style={{
                alignSelf: "flex-end",
                backgroundColor: COLORS.whiteSoft,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: COLORS.blueDark, fontWeight: "500" }}>Close</Text>
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
    <View className="mb-1 lg:mb-3 w-full">
      <Text
        className="mb-0 font-medium lg:text-md text-sm"
        style={{ color: COLORS.blueDark, }}
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
      <Text
        className="mt-4 mb-1 font-medium text-md lg:text-md"
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
      className="px-6 py-2 lg:py-3 rounded-md"
      style={{
        backgroundColor: disabled ? COLORS.blueDarker : COLORS.blueDark,
        marginTop: 15
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
function ContactSection2() {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      country: "",
      website: "",
      typeOfServices: "",
      link: "",
      returnFormat: "",
      quantity: "",
      deliveryTime: "",
      message: "",
      service: "",
    });
    const [errors, setErrors] = useState({ name: false, email: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const [showContactModal, setShowContactModal] = useState(false);
  
    // Address autocomplete
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
  
    // Simulación de subida de archivos
   const handleUploadImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      // Aquí puedes guardar las imágenes seleccionadas en tu estado
      console.log(result.assets);
      // setFormData(prev => ({ ...prev, images: result.assets }));
    }
  };
    const handleUploadFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({});
        if (result.type !== 'cancel') {
          // Aquí puedes guardar el archivo seleccionado en tu estado
          console.log(result);
          // setFormData(prev => ({ ...prev, file: result }));
        }
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
        // Puedes adaptar el objeto prospectData según tu API
        const prospectData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          country: formData.country,
          website: formData.website,
          typeOfServices: formData.typeOfServices,
          service: formData.service,
          link: formData.link,
          returnFormat: formData.returnFormat,
          quantity: formData.quantity,
          deliveryTime: formData.deliveryTime,
          message: formData.message,
          contactDate: new Date().toISOString(),
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
  
        Alert.alert("Success", "Your quote has been sent successfully!");
  
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          address: "",
          country: "",
          website: "",
          typeOfServices: "",
          link: "",
          returnFormat: "",
          quantity: "",
          deliveryTime: "",
          message: "",
          service: "",
        });
      } catch (error) {
        console.error("Submission error:", error);
        Alert.alert(
          "Error",
          "There was a problem sending your quote. Please try again later."
        );
      } finally {
        setIsSubmitting(false);
      }
    };
  
    // Opciones de servicio
    const serviceOptions = [
      "Services",
      "Other",
    ];
  
    return (
      <View className="flex justify-center items-center bg-[#FFFFFF] my-0 w-full">
        <View className="flex lg:flex-row flex-col gap-5 bg-white drop-shadow-xl mx-auto my-20 rounded-xl"
        style={{width: isDesktop ? SCREEN_WIDTH * .4 : SCREEN_WIDTH * .95}}
        >
          {/* Formulario */}
          <View className="flex-1 justify-between m-4 lg:px-0 pr-4 pb-3">
            {/* Primera fila */}
            <View className="flex flex-row justify-between gap-2 px-2 w-full overflow-hidden">
              <View className="w-1/2">
                <InputField
                  label="Name"
                  value={formData.name}
                  onChangeText={(text) => handleChange("name", text)}
                  placeholder="Name"
                  error={errors.name}
                />
              </View>
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
            </View>
            {/* Segunda fila */}
            <View className="flex flex-row justify-between gap-2 px-2 w-full overflow-hidden">
              <View className="w-1/2">
                <InputField
                  label="Phone Number"
                  value={formData.phone}
                  onChangeText={(text) => handleChange("phone", text)}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              </View>
              <View className="w-1/2">
                <InputField
                  label="Company"
                  value={formData.company}
                  onChangeText={(text) => handleChange("company", text)}
                  placeholder="Company"
                />
              </View>
            </View>
            {/* Tercera fila */}
            <View className="flex flex-row justify-between gap-2 px-2 w-full overflow-hidden">
              <View className="w-1/2">
                <InputField
                  label="Address"
                  value={formData.address}
                  onChangeText={handleAddressChange}
                  placeholder="Address"
                />
                {/* Sugerencias de dirección */}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <View className="z-50 absolute bg-white mt-1 border border-[#c9e4ff] rounded-md w-full">
                    {addressSuggestions.map((suggestion, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleAddressSelect(suggestion)}
                        className="p-2 border-gray-100 border-b"
                      >
                        <Text className="text-[#315072] text-sm">
                          {suggestion.display}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <View className="w-1/2">
                <InputField
                  label="Country"
                  value={formData.country}
                  onChangeText={(text) => handleChange("country", text)}
                  placeholder="Country"
                />
              </View>
            </View>
            {/* Cuarta fila */}
            <View className="flex flex-row justify-between items-end lg:items-start gap-2 px-2 w-full overflow-hidden">
              <View className="w-1/2">
                <InputField
                  label="Company Website / Lkdin / FB"
                  value={formData.website}
                  onChangeText={(text) => handleChange("website", text)}
                  placeholder="Website or Social"
                />
              </View>
              <View className="w-1/2">
                <InputField
                  label="Type of Services"
                  value={formData.typeOfServices}
                  onChangeText={(text) => handleChange("typeOfServices", text)}
                  placeholder="Type of Services"
                />
              </View>
            </View>
            {/* Select a Service */}
            <View className="mt-2 mb-2">
              <Text className="mb-2 font-semibold text-[#315072]">Select a Service</Text>
              <View className="flex flex-row flex-wrap gap-3">
                {serviceOptions.map((service) => (
                  <TouchableOpacity
                    key={service}
                    onPress={() =>
                      handleChange(
                        "service",
                        formData.service === service ? "" : service
                      )
                    }
                    className={`flex flex-row items-center px-3 py-1 rounded-full border ${
                      formData.service === service
                        ? "bg-[#badcff] border-[#315072]"
                        : "bg-white border-[#c9e4ff]"
                    }`}
                  >
                    <Text className="text-[#315072]">{service}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Upload Images y Upload File */}
            <View className="flex flex-row gap-4 py-2">
              <View className="flex-1 items-center">
                <Text className="mb-1 font-semibold text-[#315072] text-center">
                  Upload Images
                </Text>
                <TouchableOpacity
                  onPress={handleUploadImage}
                  className="bg-[#badcff] px-4 py-2 rounded-md w-full"
                >
                  <Text className="font-bold text-[#315072] text-center">Select Images</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-1 items-center">
                <Text className="mb-1 font-semibold text-[#315072] text-center">
                  Upload File
                </Text>
                <TouchableOpacity
                  onPress={handleUploadFile}
                  className="bg-[#badcff] px-4 py-2 rounded-md w-full"
                >
                  <Text className="font-bold text-[#315072] text-center">Select File</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Quinta fila */}
            <View className="flex flex-row justify-between gap-2 px-2 w-full overflow-hidden">
              <View className="w-1/2">
                <InputField
                  label="Link"
                  value={formData.link}
                  onChangeText={(text) => handleChange("link", text)}
                  placeholder="Paste a link"
                />
              </View>
              <View className="w-1/2">
                <InputField
                  label="Return File Format"
                  value={formData.returnFormat}
                  onChangeText={(text) => handleChange("returnFormat", text)}
                  placeholder="e.g. PDF, DWG"
                />
              </View>
            </View>
            {/* Sexta fila */}
            <View className="flex flex-row justify-between gap-2 px-2 w-full overflow-hidden">
              <View className="w-1/2">
                <InputField
                  label="Quantity"
                  value={formData.quantity}
                  onChangeText={(text) => handleChange("quantity", text)}
                  placeholder="Quantity"
                  keyboardType="numeric"
                />
              </View>
              <View className="w-1/2">
                <InputField
                  label="Delivery Time"
                  value={formData.deliveryTime}
                  onChangeText={(text) => handleChange("deliveryTime", text)}
                  placeholder="e.g. 7 days"
                />
              </View>
            </View>
            {/* Área de instrucciones */}
            <TextAreaField
              label="Write your Instructions"
              value={formData.message}
              onChangeText={(text) => handleChange("message", text)}
              placeholder="Describe your project or requirements"
            />
            {/* Botón de enviar */}
            <SubmitButton
              onPress={handleSubmit}
              label={isSubmitting ? "Sending..." : "Submit Quote"}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </View>
    );
  }