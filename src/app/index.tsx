import { useRef } from "react";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

  return (
    <View
      style={{ paddingTop: top }}
      className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
    >
      <View className="px-6 h-16 flex items-center flex-row justify-between">
        {/* Logo al estilo Vite/Next */}
        <View className="flex-row items-center">
          <Image
            source={{
              uri: "https://placehold.co/40x40/2563eb/white?text=ACME",
            }}
            className="w-10 h-10 rounded-lg mr-2"
          />
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            ACME
          </Text>
        </View>

        {/* Navegación al estilo GitHub */}
        <View className="hidden md:flex flex-row gap-6">
          {sections.map((section, index) => (
            <TouchableOpacity
              key={section}
              onPress={() => scrollToSection(index)}
              className="py-2"
            >
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white capitalize">
                {section}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botones al estilo Prisma */}
        <View className="flex flex-row gap-3">
          <TouchableOpacity className="px-4 py-2 rounded-md">
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Contactar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-4 py-2 bg-blue-600 rounded-md">
            <Text className="text-sm font-medium text-white">
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function LandingSection() {
  return (
    <View className="h-screen w-full flex items-center justify-center px-6 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <View className="max-w-3xl mx-auto">
        {/* Texto principal al estilo Vite */}
        <Text className="text-4xl md:text-6xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Transforma tu negocio con <Text className="text-blue-600">ACME</Text>
        </Text>

        {/* Descripción al estilo Next.js */}
        <Text className="text-lg md:text-xl text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
          La plataforma todo-en-uno que simplifica tus operaciones y aumenta tu
          productividad con herramientas inteligentes.
        </Text>

        {/* Botones al estilo Prisma/GitHub */}
        <View className="flex flex-col sm:flex-row justify-center gap-4">
          <TouchableOpacity className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700">
            <Text className="text-base font-medium text-white text-center">
              Comenzar ahora
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700">
            <Text className="text-base font-medium text-gray-700 dark:text-gray-300 text-center">
              Ver demo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text className="px-6 py-3 text-base font-medium text-blue-600 dark:text-blue-400 text-center">
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
    <View className="h-screen w-full flex items-center justify-center px-6 bg-white dark:bg-gray-950">
      <View className="max-w-6xl mx-auto">
        <Text className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Nuestros Servicios
        </Text>

        <View className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <View
              key={index}
              className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition-all"
            >
              <Text className="text-3xl mb-4">{service.icon}</Text>
              <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
  return (
    <View className="h-screen w-full flex items-center justify-center px-6 bg-gray-50 dark:bg-gray-900">
      <View className="max-w-2xl mx-auto w-full">
        <Text className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Contáctanos
        </Text>

        <Text className="text-lg text-center text-gray-600 dark:text-gray-300 mb-10">
          ¿Listo para comenzar? Envíanos un mensaje y te responderemos en menos
          de 24 horas.
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre
            </Text>
            <View className="h-10 border border-gray-300 dark:border-gray-700 rounded-md px-3 bg-white dark:bg-gray-800" />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </Text>
            <View className="h-10 border border-gray-300 dark:border-gray-700 rounded-md px-3 bg-white dark:bg-gray-800" />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mensaje
            </Text>
            <View className="h-32 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800" />
          </View>

          <TouchableOpacity className="mt-4 px-6 py-3 rounded-md bg-blue-600">
            <Text className="text-base font-medium text-white text-center">
              Enviar mensaje
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function Footer() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800"
      style={{ paddingBottom: bottom }}
    >
      <View className="px-6 py-8 max-w-6xl mx-auto">
        <View className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo y copyright */}
          <View className="flex items-center md:items-start mb-6 md:mb-0">
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: "https://placehold.co/40x40/2563eb/white?text=ACME",
                }}
                className="w-8 h-8 rounded-lg mr-2"
              />
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                ACME
              </Text>
            </View>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              © {new Date().getFullYear()} ACME Inc. Todos los derechos
              reservados.
            </Text>
          </View>

          {/* Links rápidos */}
          <View className="grid grid-cols-2 gap-8">
            <View className="space-y-2">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                Producto
              </Text>
              <View className="space-y-1">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Características
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Precios
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Documentación
                </Text>
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                Compañía
              </Text>
              <View className="space-y-1">
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Nosotros
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Blog
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
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
