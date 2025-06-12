export default function ContactSection2() {
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
    const handleUploadImage = () => {
      Alert.alert("Upload Images", "Funcionalidad pendiente de implementar.");
    };
    const handleUploadFile = () => {
      Alert.alert("Upload File", "Funcionalidad pendiente de implementar.");
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
      <View className="flex justify-center items-center bg-[#FFFFFF] mt-5 px-6 w-full">
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
  
          {/* Formulario */}
          <View className="flex-1 space-y-1 m-2 px-5 lg:px-0 pr-4 pb-3 min-w-0">
            {/* Primera fila */}
            <View className="flex flex-row justify-between gap-2 w-full overflow-hidden">
              <View className="w-1/2">
                <InputField
                  label="Name"
                  value={formData.name}
                  onChangeText={(text) => handleChange("name", text)}
                  placeholder="Name"
                  error={errors.name}
                />
              </View>
              <View className="w-2/5 lg:w-60">
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
            <View className="flex flex-row justify-between gap-2 w-full overflow-hidden">
              <View className="w-1/2">
                <InputField
                  label="Phone Number"
                  value={formData.phone}
                  onChangeText={(text) => handleChange("phone", text)}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              </View>
              <View className="w-2/5 lg:w-60">
                <InputField
                  label="Company"
                  value={formData.company}
                  onChangeText={(text) => handleChange("company", text)}
                  placeholder="Company"
                />
              </View>
            </View>
            {/* Tercera fila */}
            <View className="flex flex-row justify-between gap-2 w-full overflow-hidden">
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
              <View className="w-2/5 lg:w-60">
                <InputField
                  label="Country"
                  value={formData.country}
                  onChangeText={(text) => handleChange("country", text)}
                  placeholder="Country"
                />
              </View>
            </View>
            {/* Cuarta fila */}
            <View className="flex flex-row justify-between gap-2 w-full overflow-hidden">
              <View className="w-1/2">
                <InputField
                  label="Company Website/Linkedin/FB"
                  value={formData.website}
                  onChangeText={(text) => handleChange("website", text)}
                  placeholder="Website or Social"
                />
              </View>
              <View className="w-2/5 lg:w-60">
                <InputField
                  label="Type of Services"
                  value={formData.typeOfServices}
                  onChangeText={(text) => handleChange("typeOfServices", text)}
                  placeholder="Type of Services"
                />
              </View>
            </View>
            {/* Select a Service */}
            <View className="mt-4 mb-2">
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
            <View className="flex flex-row gap-4 py-5">
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
            <View className="flex flex-row justify-between gap-2 w-full overflow-hidden">
              <View className="w-1/2">
                <InputField
                  label="Link"
                  value={formData.link}
                  onChangeText={(text) => handleChange("link", text)}
                  placeholder="Paste a link"
                />
              </View>
              <View className="w-2/5 lg:w-60">
                <InputField
                  label="Return File Format"
                  value={formData.returnFormat}
                  onChangeText={(text) => handleChange("returnFormat", text)}
                  placeholder="e.g. PDF, DWG"
                />
              </View>
            </View>
            {/* Sexta fila */}
            <View className="flex flex-row justify-between gap-2 w-full overflow-hidden">
              <View className="w-1/2">
                <InputField
                  label="Quantity"
                  value={formData.quantity}
                  onChangeText={(text) => handleChange("quantity", text)}
                  placeholder="Quantity"
                  keyboardType="numeric"
                />
              </View>
              <View className="w-2/5 lg:w-60">
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