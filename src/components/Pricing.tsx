import { useState } from "react";
import { Text, View, TouchableOpacity, Alert, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { SERVER_URL } from "@env";
import axios from "axios";
import { useWindowDimensions } from "react-native";
import { InputField } from "./InputField";
import { SubmitButton } from "./SubmitButton";
import { TextAreaField } from "./TextAreaField";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const { height: SCREEN_HEIGHT } = Dimensions.get("screen");
export function ContactSection2() {
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
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    const result: any = await DocumentPicker.getDocumentAsync({});
    if (result.type !== "cancel") {
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
  const serviceOptions = ["Services", "Other"];

  return (
    <View className="flex justify-center items-center bg-[#FFFFFF] my-0 w-full">
      <View
        className="flex lg:flex-row flex-col gap-5 bg-white drop-shadow-xl mx-auto my-20 rounded-xl"
        style={{ width: isDesktop ? SCREEN_WIDTH * 0.4 : SCREEN_WIDTH * 0.95 }}
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
            <Text className="mb-2 font-semibold text-[#315072]">
              Select a Service
            </Text>
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
                <Text className="font-bold text-[#315072] text-center">
                  Select Images
                </Text>
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
                <Text className="font-bold text-[#315072] text-center">
                  Select File
                </Text>
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
