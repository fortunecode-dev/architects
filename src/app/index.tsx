import React, { useRef, useEffect, useState, useCallback } from "react";
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
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MAIL_CONTACT, PHONE_CONTACT, WHATSAPP_CONTACT } from "@env";
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import useScrolled from "@/hooks/useScroll";
import { postProspect, postQuestion } from "@/services/prospect.service";
import { COLORS } from "./colors";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SubmitButton } from "@/components/SubmitButton";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

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
    contact2: useRef<View>(null),
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
        {/* <View
          ref={sectionRefs.contact2}
          style={{ height: isLargeScreen ? height : "auto" }}
        > */}
        {/* <ContactSection2 /> */}
        {/* </View> */}
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
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const { width } = useWindowDimensions();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

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
          {/* Left: Logo - Reemplazado por texto dW+ */}
          <View className="flex-row flex-shrink-0 flex-1 items-center px-1">
            <TouchableOpacity onPress={() => scrollToSection("home")}>
              <Text
                className="font-bold text-2xl"
                style={{ color: COLORS.blueDark }}
              >
                dW+
              </Text>
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
                  {t(`header.sections.${section}`)}
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
          <View className="hidden md:flex flex-row flex-1 justify-end items-center">
            {/* Iconos de redes sociales */}
            <TouchableOpacity
              onPress={toggleLanguage}
              className="flex-row items-center mr-3"
              accessibilityLabel="Change language"
            >
              <Text
                className="mr-1 font-bold text-sm"
                style={{ color: COLORS.blueDark }}
              >
                {i18n.language === "en" ? "EN" : "ES"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.facebook.com/tu-negocio")
              }
              accessibilityLabel="Facebook"
            >
              <Ionicons
                name="logo-facebook"
                size={26}
                color={COLORS.blueDark}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.instagram.com/tu-negocio")
              }
              className="ml-3"
              accessibilityLabel="Instagram"
            >
              <Ionicons
                name="logo-instagram"
                size={26}
                color={COLORS.blueDark}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-3 py-1.5 rounded-md transition-all duration-300`}
              style={{ backgroundColor: COLORS.blueDark, marginLeft: 12 }}
              onPress={() => scrollToSection("contact")}
            >
              <Text
                className={`font-bold text-sm`}
                style={{ color: COLORS.white }}
              >
                {t("common.contact")}
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
                    className={`font-medium text-4xl uppercase  text-center`}
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
                    className={` font-bold text-center text-xl`}
                    style={{ color: COLORS.white }}
                  >
                    {t("common.contact")}
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
  const { t } = useTranslation();

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
            <View
              className="flex flex-col justify-start lg:justify-center items-center lg:pb-24 w-full h-full"
              style={{
                paddingTop: isDesktop
                  ? 0
                  : isTablet
                  ? SCREEN_WIDTH * 0.25
                  : SCREEN_WIDTH * 0.3,
              }}
            >
              <View className="flex justify-center items-center w-full">
                <Image
                  source={"logo-navy.png"}
                  style={{
                    width: SCREEN_WIDTH * 0.9,
                    height: isDesktop
                      ? SCREEN_WIDTH * 0.15
                      : isTablet
                      ? SCREEN_WIDTH * 0.25
                      : SCREEN_WIDTH * 0.42,
                    resizeMode: "contain",
                  }}
                  resizeMode="contain"
                />
              </View>
              <View className="flex flex-col justify-center items-center gap-2">
                <Text
                  className="justify-center items-center lg:mt-5 mb-1 lg:p-0 md:py-4 font-semibold text-center"
                  style={{
                    color: COLORS.blueDark,
                    fontSize: isDesktop ? 22 : SCREEN_WIDTH * 0.038,
                  }}
                >
                  {t(`landing.title`)}
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
                      {t(`common.moreInfo`)}
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
                      {t(`common.getStarted`)}
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
  const { t } = useTranslation();
  const serviceImages = {
    adu: [
      require("../images/ADU/6.webp"),
      require("../images/ADU/1.webp"),
      require("../images/ADU/2.webp"),
      require("../images/ADU/3.webp"),
      require("../images/ADU/4.webp"),
    ],
    remodeling: [
      require("../images/REMODELATION/2.webp"),
      require("../images/REMODELATION/1.webp"),
      require("../images/REMODELATION/3.webp"),
      require("../images/REMODELATION/4.webp"),
    ],
    backyard: [
      require("../images/BACKYARD/7.webp"),
      require("../images/BACKYARD/1.webp"),
      require("../images/BACKYARD/2.webp"),
      require("../images/BACKYARD/3.webp"),
    ],
    repair: [
      require("../images/REPAIR/11.webp"),
      require("../images/REPAIR/1.webp"),
      require("../images/REPAIR/2.webp"),
      require("../images/REPAIR/3.webp"),
    ],
    support: [
      require("../images/FINANCING/2.webp"),
      require("../images/FINANCING/1.webp"),
      require("../images/FINANCING/3.webp"),
    ],
  };
  const services = (
    t("services.servicesList", { returnObjects: true }) as Array<any>
  ).map((service: any) => ({
    ...service,
    images: serviceImages[service.id], // Asignamos las imágenes basadas en un ID único
  }));
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
      prev === services[selectedService].images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? services[selectedService].images.length - 1 : prev - 1
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
                onPress={() => openModalWithService(index)}
                key={index}
                className="flex flex-col justify-between mb-2 p-3 border rounded-xl transition-shadow duration-300"
                style={{
                  backgroundColor: COLORS.blueDark,
                  borderColor: COLORS.border,
                  backgroundImage:
                    "linear-gradient(334deg, rgb(233, 238, 245) 0%, rgb(205, 220, 239) 100%)",
                  border: "none",
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
                  className="mb-1 lg:mb-2 font-bold text-xl"
                  style={{ color: COLORS.blueDarker }}
                >
                  {service.title}
                </Text>
                <Text
                  className="mb-1 lg:mb-2 font-semibold text-md"
                  style={{ color: COLORS.blueDarker }}
                >
                  {service.description}
                </Text>
                <Text
                  className="mt-4 pr-2 font-bold text-end transition-colors duration-300"
                  style={{ color: COLORS.blueDark }}
                >
                  {t("common.readMore")}
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
        <View
          className="flex-col-reverse flex-1 justify-center items-center gap-2"
          style={{ backgroundColor: COLORS.blackOverlay }}
        >
          <View
            className="relative lg:flex-row flex-col-reverse justify-center lg:items-center gap-5 m-5"
            style={{
              backgroundColor: COLORS.white,
              marginHorizontal: 8,
              padding: 20,
              borderRadius: 16,
              maxWidth: isDesktop ? SCREEN_WIDTH * 0.7 : SCREEN_WIDTH * 0.95,
              height: isDesktop
                ? "auto"
                : isTablet
                ? SCREEN_WIDTH * 1.2
                : "auto",
            }}
          >
            <TouchableOpacity
              onPress={handleCloseModal}
              className="top-4 right-4 z-10 absolute justify-center items-center -m-3 p-4 rounded-full"
            >
              <Ionicons name="close" size={28} color={COLORS.blueDark} />
            </TouchableOpacity>

            <View className="flex-col flex-1 justify-center gap-2 mb-0 pr-0 lg:pr-6 pb-3 min-w-0 max-w-full">
              <Text
                className="hidden lg:block lg:py-3 font-bold text-2xl lg:text-4xl"
                style={{ color: COLORS.blueDark }}
              >
                {services[selectedService]?.title}
              </Text>
              <Text
                className="flex-1 my-0 pt-8 lg:pt-0 text-[15px] md:text-2xl"
                style={{ color: COLORS.blueDark }}
              >
                {services[selectedService]?.content}
              </Text>
              <View className="flex flex-row flex-wrap flex-1 justify-end items-end gap-2 my-5 w-full">
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setTimeout(() => setQuestionModalVisible(true), 300);
                  }}
                  style={{
                    borderColor: COLORS.border,
                    // borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    // borderRadius: 6,
                  }}
                >
                  <Text
                    style={{ color: COLORS.blueDark, fontWeight: "500" }}
                    className="lg:p-1 lg:text-2xl"
                  >
                    {t("services.makeQuestion")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleGetStarted}
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.blueDark,
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{ color: COLORS.whiteSoft, fontWeight: "500" }}
                    className="lg:p-1 lg:text-2xl"
                  >
                    {t("common.getStarted")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="relative flex-1 pt-3">
              <View className="lg:hidden top-0 right-0 left-0 z-10 my-2 rounded-t-xl">
                {services.map((service, index) => {
                  if (service.title === services[selectedService]?.title) {
                    return (
                      <View key={index} className="w-full h-full">
                        <Text
                          className="font-bold text-2xl"
                          style={{ color: COLORS.blueDark }}
                        >
                          {service.title}
                        </Text>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
              {/* Carousel */}
              <View className="justify-center items-center p-4 w-full h-full">
                <Image
                  source={services[selectedService]?.images[currentImageIndex]}
                  style={{
                    width: isDesktop
                      ? SCREEN_WIDTH * 0.3
                      : isTablet
                      ? SCREEN_WIDTH * 0.8
                      : SCREEN_WIDTH * 0.75,
                    height: isDesktop
                      ? SCREEN_WIDTH * 0.2
                      : isTablet
                      ? SCREEN_WIDTH * 0.4
                      : SCREEN_HEIGHT * 0.2,
                    marginVertical: isTablet ? 20 : 0,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                  className="m-10 lg:mt-0 mb-2"
                />

                {/* Navigation Arrows */}
                <TouchableOpacity
                  onPress={handlePrevImage}
                  className="top-1/2 left-0 absolute -mx-3 p-1 rounded-full -translate-y-1/2"
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={COLORS.blueDark}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNextImage}
                  className="top-1/2 right-0 absolute -mx-3 p-1 rounded-full -translate-y-1/2"
                >
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={COLORS.blueDark}
                  />
                </TouchableOpacity>

                {/* Indicators */}
                <View className="flex-row justify-center mt-4">
                  {services[selectedService]?.images.map((_, index) => (
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
                {/* <View
                  style={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    backgroundColor: COLORS.blackOverlay,
                    paddingHorizontal: 8,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: COLORS.white, fontSize: 12 }}>
                    {currentImageIndex + 1}/{selectedService?.images.length}
                  </Text>
                </View> */}
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
                fontSize: 18,
                textAlign: "center",
              }}
            >
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
              <Text
                style={{
                  marginBottom: 8,
                  color: "green",
                  textAlign: "center",
                }}
              >
                Thanks, we will get back to you soon!
              </Text>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
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
                <Text style={{ color: COLORS.blueDark, textAlign: "center" }}>
                  Close
                </Text>
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
                <Text
                  style={{
                    fontWeight: "bold",
                    color: COLORS.blueDark,
                    textAlign: "center",
                  }}
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
function FAQSection({
  scrollToSection,
}: {
  scrollToSection: (section: string) => void;
}) {
  const { t } = useTranslation();
  const faqs = t("faq.questions", { returnObjects: true });

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [contactType, setContactType] = useState<"email" | "phone" | null>(
    null
  );
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

  const handleContactSubmit = useCallback(() => {
    if (!isContactValid) return;
    postQuestion({ [contactType]: contactInfo, metadata: { question } }).then(
      () => {
        setSubmitted(false);
        setShowContactModal(false);
        setSubmitted(true);
        setQuestion("");
        setContactInfo("");
        setContactType(null);
      }
    );
  }, [contactInfo, contactType, question]);

  // Divide las preguntas en 2 columnas
  const colLength = Math.ceil((faqs as Array<any>).length / 2);
  const columns = [
    (faqs as Array<any>).slice(0, colLength),
    (faqs as Array<any>).slice(colLength),
  ];

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
        {t("faq.title")}
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
                          ? COLORS.blueDark
                          : COLORS.whiteSoft,
                      shadowColor: COLORS.gray,
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                    }}
                  >
                    <Text
                      className={
                        selectedIndex === realIdx && !isMobile
                          ? "font-bold"
                          : "font-semibold"
                      }
                      style={{
                        color:
                          selectedIndex === realIdx && !isMobile
                            ? "white"
                            : COLORS.blueDark,
                      }}
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
                <Text className="mt-4 text-center" style={{ color: "green" }}>
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
                  backgroundColor: isContactValid ? COLORS.accent : COLORS.gray,
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
  const { t } = useTranslation();

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

      postProspect(prospectData)
        .then(() => {
          Alert.alert("Success", "Your message has been sent successfully!");
        })
        .catch(() => {
          throw new Error("Failed to submit form");
        });

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
                {t("contact.title")}
              </Text>
              <View style={{ gap: 16 }}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${PHONE_CONTACT}`);
                    setShowContactModal(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Ionicons name="call" color={COLORS.whiteSoft} size={28} />
                  <Text style={{ color: COLORS.whiteSoft, fontSize: 18 }}>
                    {t("methods.phone")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`sms:${PHONE_CONTACT}`);
                    setShowContactModal(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingVertical: 8,
                  }}
                >
                  <MaterialIcons
                    name="sms"
                    color={COLORS.whiteSoft}
                    size={28}
                  />
                  <Text style={{ color: COLORS.whiteSoft, fontSize: 18 }}>
                    Message
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`https://wa.me/${WHATSAPP_CONTACT}`);
                    setShowContactModal(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Ionicons
                    name="logo-whatsapp"
                    color={COLORS.whiteSoft}
                    size={28}
                  />
                  <Text style={{ color: COLORS.whiteSoft, fontSize: 18 }}>
                    Whatsapp
                  </Text>
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
                <Text style={{ color: COLORS.blueDark, fontWeight: "500" }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View
        className="flex lg:flex-row flex-col gap-5 drop-shadow-xl mx-auto my-20 rounded-xl w-full max-w-6xl"
        style={{ backgroundColor: COLORS.white }}
      >
        {/* Contact Info */}
        <View
          style={{
            backgroundImage:
              "linear-gradient(131deg, rgb(49, 80, 114) 0%, rgb(108 155 201) 100%)",
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
            {t("contact.title")}
          </Text>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 18,
              textAlign: "left",
              marginBottom: isDesktop ? 0 : 12,
            }}
          >
            {t("contact.subtitle")}
          </Text>
          {/* Mensaje SOLO en móvil */}
          {!isDesktop && (
            <View style={{ marginTop: 8, marginBottom: 16 }}>
              <Text style={{ color: COLORS.whiteSoft }}>
                Email us at{" "}
                <Text
                  style={{
                    fontWeight: "bold",
                    color: COLORS.whiteSoft,
                    textDecorationLine: "underline",
                  }}
                  onPress={() => Linking.openURL(`mailto:${MAIL_CONTACT}`)}
                >
                  {MAIL_CONTACT}
                </Text>{" "}
              </Text>
              <Text style={{ color: COLORS.whiteSoft }}>
                Or use this number{" "}
                <Text
                  style={{
                    fontWeight: "bold",
                    color: COLORS.whiteSoft,
                    textDecorationLine: "underline",
                  }}
                  onPress={() => setShowContactModal(true)}
                >
                  {PHONE_CONTACT}
                </Text>
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 24,
                  gap: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://www.facebook.com/tu-negocio")
                  }
                  accessibilityLabel="Facebook"
                >
                  <Ionicons
                    name="logo-facebook"
                    size={32}
                    color={COLORS.whiteSoft}
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
                    size={32}
                    color={COLORS.whiteSoft}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL("https://m.me/tu-negocio")}
                  accessibilityLabel="Messenger"
                >
                  <MaterialCommunityIcons
                    name="facebook-messenger"
                    size={32}
                    color={COLORS.whiteSoft}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL("https://wa.me/1234567890")}
                  accessibilityLabel="Whatsapp"
                >
                  <Ionicons
                    name="logo-whatsapp"
                    size={32}
                    color={COLORS.whiteSoft}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Contactos visibles solo en escritorio */}
          {isDesktop && (
            <>
              <View
                style={{
                  flexDirection: "column",
                  marginTop: 122,
                  paddingBottom: 20,
                }}
                className="items-center h-1/3"
              >
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
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: COLORS.white,
                          fontSize: 18,
                        }}
                      >
                        {PHONE_CONTACT}
                      </Text>
                      <Text style={{ color: COLORS.white }} className="text-xl">
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
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: COLORS.white,
                          fontSize: 18,
                        }}
                      >
                        {MAIL_CONTACT}
                      </Text>
                      <Text style={{ color: COLORS.white }} className="text-xl">
                        Email us to discuss your project
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL("https://www.facebook.com/tu-negocio")
                    }
                    accessibilityLabel="Facebook"
                  >
                    <Ionicons
                      name="logo-facebook"
                      size={32}
                      color={COLORS.whiteSoft}
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
                      size={32}
                      color={COLORS.whiteSoft}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL("https://m.me/tu-negocio")}
                    accessibilityLabel="Messenger"
                  >
                    <MaterialCommunityIcons
                      name="facebook-messenger"
                      size={32}
                      color={COLORS.whiteSoft}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => Linking.openURL("https://wa.me/1234567890")}
                    accessibilityLabel="Whatsapp"
                  >
                    <Ionicons
                      name="logo-whatsapp"
                      size={32}
                      color={COLORS.whiteSoft}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Formulario */}
        <View className="flex-1 space-y-1 m-2 px-5 pr-4 lg:pr-4 pb-3 min-w-0">
          <View className="flex flex-row justify-between gap-1 lg:pt-5 w-full overflow-hidden">
            <View style={{ flex: 1 }}>
              <InputField
                label={t("contact.form.firstName")}
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                placeholder={t("contact.form.firstName")}
                error={errors.name}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <InputField
                label={t("contact.form.lastName")}
                autoComplete="family-name"
                value={formData.lastName}
                onChangeText={(text) => handleChange("lastName", text)}
                placeholder={t("contact.form.lastName")}
              />
            </View>
          </View>

          <View className="relative flex flex-row justify-between gap-2 w-full overflow-hidden">
            <View style={{ flex: 1 }}>
              <InputField
                label={t("contact.form.email")}
                autoComplete="email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder={t("contact.form.email")}
                keyboardType="email-address"
                error={errors.email}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <InputField
                label={t("contact.form.phone")}
                autoComplete="tel"
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
                placeholder={t("contact.form.phone")}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View className="z-10 relative">
            <InputField
              label={t("contact.form.address")}
              autoComplete="street-address"
              value={formData.address}
              onChangeText={handleAddressChange}
              placeholder={t("contact.form.address")}
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
                    <Text style={{ color: COLORS.blueDark }}>
                      {item.display}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Campos autocompletados (ciudad, estado, código postal) */}
          <View className="flex flex-row gap-4 w-full overflow-hidden">
            <View style={{ flex: 1 }}>
              <InputField
                label={t("contact.form.city")}
                value={formData.city}
                onChangeText={(text) => handleChange("city", text)}
                placeholder={t("contact.form.city")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <InputField
                label={t("contact.form.state")}
                value={formData.state}
                onChangeText={(text) => handleChange("state", text)}
                placeholder={t("contact.form.state")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <InputField
                label={t("contact.form.zip")}
                autoComplete="postal-code"
                value={formData.postal}
                onChangeText={(text) => handleChange("postal", text)}
                placeholder={t("contact.form.zip")}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TextAreaField
            label={t("contact.form.message")}
            value={formData.message}
            onChangeText={(text) => handleChange("message", text)}
            placeholder={t("contact.form.message")}
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
  const router = useRouter();
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
        backgroundImage:
          "linear-gradient(150deg, rgb(49, 80, 114) 0%, rgb(108, 155, 201) 100%)",
        borderTopWidth: 1,
        borderColor: COLORS.accent,
        paddingBottom: bottom,
      }}
    >
      <View className="mx-auto px-6 py-2 w-full max-w-6xl">
        <View className="flex md:flex-row flex-col justify-between items-center w-full">
          <View className="flex items-center md:items-start mb-6 md:mb-0">
            {/* <View className="flex-row items-center">
              <Image
                source={require("../../public/logo-navy.png")}
                className="mr-2 rounded-lg max-w-56 max-h-12"
              />
            </View> */}
            <Text
              style={{ marginTop: 8, color: COLORS.whiteSoft, fontSize: 14 }}
            >
              DwellingPlus © {new Date().getFullYear()} All rights reserved.
            </Text>
            <Text
              style={{ marginTop: 4, color: COLORS.whiteSoft, fontSize: 12 }}
            >
              Map data © OpenStreetMap contributors
            </Text>
            <Text
              style={{
                color: COLORS.whiteSoft,
                fontSize: 12,
                textDecorationLine: "underline",
                marginTop: 2,
              }}
              onPress={() =>
                Linking.openURL(
                  "https://www.vecteezy.com/free-photos/mobile-homes"
                )
              }
            >
              Mobile Homes Stock photos by Vecteezy
            </Text>
            <Text
              style={{
                color: COLORS.whiteSoft,
                fontSize: 12,
                textDecorationLine: "underline",
                marginTop: 2,
              }}
              onPress={() => router.navigate("/admin")}
            >
              Admin Panel
            </Text>
          </View>

          <View className="gap-8 grid grid-cols-2">
            <View className="space-y-2">
              <Text
                style={{
                  fontWeight: "bold",
                  color: COLORS.whiteSoft,
                  fontSize: 14,
                }}
              >
                Content
              </Text>
              <View className="space-y-1">
                <Text
                  style={{ color: COLORS.whiteSoft, fontSize: 14 }}
                  onPress={() => scrollToSection?.("services", true)}
                >
                  Services
                </Text>
                <Text
                  style={{ color: COLORS.whiteSoft, fontSize: 14 }}
                  onPress={() => scrollToSection?.("faq", true)}
                >
                  FAQs
                </Text>
              </View>
            </View>

            <View className="space-y-2">
              <Text
                style={{
                  fontWeight: "bold",
                  color: COLORS.whiteSoft,
                  fontSize: 14,
                }}
              >
                Company
              </Text>
              <View className="space-y-1">
                <Text
                  style={{ color: COLORS.whiteSoft, fontSize: 14 }}
                  onPress={() => setModalVisible("dwelling")}
                >
                  About
                </Text>
                <Text
                  style={{ color: COLORS.whiteSoft, fontSize: 14 }}
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
              <Ionicons
                name="logo-facebook"
                size={28}
                color={COLORS.whiteSoft}
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
                color={COLORS.whiteSoft}
              />
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
            <Text
              style={{
                marginBottom: 8,
                color: COLORS.whiteSoft,
                fontSize: 22,
              }}
            >
              {about[modalVisible]?.title}
            </Text>
            <Text
              style={{
                marginBottom: 24,
                color: COLORS.whiteSoft,
                fontSize: 16,
              }}
            >
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
              <Text style={{ color: COLORS.whiteSoft, fontWeight: "500" }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
