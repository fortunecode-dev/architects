import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
  Dimensions,
} from "react-native";

import {
  getProspect,
  updateProspect,
  postProspect,
} from "@/services/prospect.service";
import MediaUploader from "@/components/MediaUploader";

// 🔥 Metadata del formulario (como la tenías)
const formMeta = [
  {
    name: "propertyAddress",
    label: "Property Address",
    type: "text",
    category: "PROPERTY INFORMATION",
    multiline: true,
    placeholder: "Enter full property address...",
  },
  {
    name: "city",
    label: "City",
    type: "text",
    category: "PROPERTY INFORMATION",
    placeholder: "Enter city name...",
  },
  {
    name: "zoning",
    label: "Zoning",
    type: "text",
    category: "PROPERTY INFORMATION",
    placeholder: "Enter zoning info...",
  },
  {
    name: "lotArea",
    label: "Lot Area",
    type: "number",
    category: "PROPERTY INFORMATION",
    placeholder: "Enter lot area in sqft...",
  },
  {
    name: "houseType",
    label: "House Type",
    type: "text",
    category: "PROPERTY INFORMATION",
    placeholder: "Enter house type...",
  },
  {
    name: "ownerOccupation",
    label: "Owner Occupation",
    type: "text",
    category: "PROPERTY INFORMATION",
    placeholder: "Enter owner occupation...",
  },
  {
    name: "buildingArea",
    label: "Building Area",
    type: "number",
    category: "PROPERTY INFORMATION",
    placeholder: "Enter building area in sqft...",
  },
  {
    name: "units",
    label: "# Units",
    type: "number",
    category: "PROPERTY INFORMATION",
    placeholder: "Number of units...",
  },
  {
    name: "bedrooms",
    label: "Bedrooms",
    type: "number",
    category: "PROPERTY INFORMATION",
    placeholder: "Number of bedrooms...",
  },
  {
    name: "bathrooms",
    label: "Bathrooms",
    type: "number",
    category: "PROPERTY INFORMATION",
    placeholder: "Number of bathrooms...",
  },
  {
    name: "propertyValue",
    label: "Property Value",
    type: "number",
    category: "PROPERTY INFORMATION",
    placeholder: "Estimated property value...",
  },

  // OWNER PROFILE
  {
    name: "character",
    label: "Character",
    type: "text",
    category: "OWNER PROFILE",
    placeholder: "Enter character...",
  },
  {
    name: "fico",
    label: "FICO",
    type: "number",
    category: "OWNER PROFILE",
    placeholder: "FICO score...",
  },
  {
    name: "income",
    label: "Income",
    type: "number",
    category: "OWNER PROFILE",
    placeholder: "Annual income...",
  },
  {
    name: "loanAmount",
    label: "L/A",
    type: "number",
    category: "OWNER PROFILE",
    placeholder: "Loan amount...",
  },
  {
    name: "rate",
    label: "Rate",
    type: "number",
    category: "OWNER PROFILE",
    placeholder: "Interest rate...",
  },
  {
    name: "pi",
    label: "PI",
    type: "number",
    category: "OWNER PROFILE",
    placeholder: "Principal & Interest...",
  },
  {
    name: "pt",
    label: "PT",
    type: "number",
    category: "OWNER PROFILE",
    placeholder: "Property Tax...",
  },
  {
    name: "debt",
    label: "Debt",
    type: "number",
    category: "OWNER PROFILE",
    placeholder: "Current debts...",
  },

  {
    name: "objective",
    label: "Objective",
    type: "checkbox",
    options: [
      "ADU",
      "JADU",
      "New Unit(s)",
      "Interior Remodeling",
      "Home Addition",
      "Repair",
      "Yard Improvement",
    ],
    category: "OBJECTIVE",
  },

  {
    name: "cautiousNotes",
    label:
      "CAUTIOUS (easements, p.u.e, tree, slopes, illegal structures, nonconforming setbacks, existing main panel capacity, existing fire sprinklers)",
    type: "text",
    category: "ANNOTATIONS",
    multiline: true,
    placeholder:
      "Notas sobre condiciones que deben ser tenidas en cuenta...",
  },
  {
    name: "finalScopeOfWork",
    label: "FINAL SCOPE OF WORK",
    type: "text",
    category: "ANNOTATIONS",
    multiline: true,
    placeholder: "Notas sobre alcance final del trabajo...",
  },
  {
    name: "generalNotes",
    label: "GENERAL NOTES",
    type: "text",
    category: "ANNOTATIONS",
    multiline: true,
    placeholder: "Notas generales...",
  },
];

type FormData = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
};

const ClientForm = () => {
  const router = useRouter();
  const { id, mode: rawMode } = useLocalSearchParams();
  const mode = (rawMode as "edit" | "view" | "new") || (id ? "edit" : "new");
  const isEditing = mode === "edit";
  const isViewing = mode === "view";
  const [showMetadata, setShowMetadata] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [metadata, setMetaData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [...Array.from(new Set(formMeta.map((f) => f.category))), "ATTACHMENTS"];
  const [activeTab, setActiveTab] = useState(formMeta[0].category||"STATIC");

  useEffect(() => {
    const loadClientData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const client = await getProspect(id as string);
          setFormData({
            name: client.name || "",
            lastName: client.lastName || "",
            email: client.email || "",
            phone: client.phone || "",
            address: client.address || "",
            city: client.city || "",
            state: client.state || "",
          });
          setMetaData(client.metadata || {});
        } catch (error) {
          Alert.alert("Error", "No se pudo cargar los datos del cliente");
          router.back();
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadClientData();
  }, [id]);

  const handleStaticChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleMetaChange = (name: string, value: any) => {
    setMetaData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "First name is required";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (formData.phone && !/^[\d\s\+\-\(\)]{10,15}$/.test(formData.phone))
      newErrors.phone = "Invalid phone";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isViewing) {
      router.back();
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = { ...formData, metadata };
      if (isEditing) {
        await updateProspect(id as string, payload);
        Alert.alert("Éxito", "Cliente actualizado");
      } else {
        await postProspect(payload);
        Alert.alert("Éxito", "Cliente creado");
        setFormData({
          name: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
        });
        setMetaData({});
      }
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMetaField = (field) => {
    const value = metadata[field.name] ?? (field.type === "checkbox" ? [] : "");

    switch (field.type) {
      case "text":
      case "number":
        return (
          <TextInput
            className="border border-slate-300 rounded-md px-4 py-2 bg-white"
            keyboardType={field.type === "number" ? "numeric" : "default"}
            value={String(value)}
            onChangeText={(text) => handleMetaChange(field.name, text)}
            placeholder={field.placeholder ?? field.label}
            multiline={!!field.multiline}
            editable={!isViewing}
            style={
              field.multiline ? { height: 80, textAlignVertical: "top" } : undefined
            }
          />
        );
      case "checkbox":
        return field.options?.map((option) => {
          const selected = value.includes(option);
          return (
            <View key={option} className="flex-row justify-between items-center mb-2">
              <Text>{option}</Text>
              <Switch
                value={selected}
                onValueChange={(val) => {
                  if (isViewing) return;
                  const newValue = val
                    ? [...value, option]
                    : value.filter((v) => v !== option);
                  handleMetaChange(field.name, newValue);
                }}
              />
            </View>
          );
        });
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <ScrollView className="flex-1 p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold">
            {mode === "new"
              ? "New Client"
              : isEditing
              ? "Edit Client"
              : "Client Information"}
          </Text>
          <TouchableOpacity
            className="bg-slate-200 px-3 py-1 rounded-md"
            onPress={() => setShowMetadata(!showMetadata)}
          >
            <Text className="text-slate-700">
              {showMetadata ? "Basic Form" : "Metadata Form"}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          className="flex-row gap-4"
          style={{
            flexWrap: Dimensions.get("window").width < 700 ? "wrap" : "nowrap",
          }}
        >
          {showMetadata ? (
            <View className="flex-1 bg-white rounded-lg p-4">
              <View className="flex-row border-b border-slate-200 mb-4">
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setActiveTab(cat)}
                    className={`flex-1 py-2 items-center ${
                      activeTab === cat ? "border-b-2 border-emerald-500" : ""
                    }`}
                  >
                    <Text
                      className={`text-base ${
                        activeTab === cat
                          ? "text-emerald-500 font-semibold"
                          : "text-slate-500"
                      }`}
                    >
                      {cat === "ATTACHMENTS" ? "Attachments" : cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="mb-4 p-3 rounded-md bg-slate-100">
                <Text className="text-slate-700 font-semibold">
                  {formData.name} {formData.lastName}
                </Text>
                <Text className="text-slate-500">{formData.address}</Text>
              </View>

              {formMeta
                .filter((f) => f.category === activeTab)
                .reduce((acc, field, index, arr) => {
                  const isNumber = field.type === "number";
                  if (isNumber) {
                    const next = arr[index + 1];
                    if (next && next.type === "number") {
                      acc.push([field, next]);
                      arr.splice(index + 1, 1);
                    } else {
                      acc.push([field]);
                    }
                  } else {
                    acc.push([field]);
                  }
                  return acc;
                }, [] as any[])
                .map((group) => (
                  <View
                    key={group.map((g) => g.name).join("-")}
                    className={`mb-4 ${group.length === 2 ? "flex-row gap-4" : ""}`}
                  >
                    {group.map((field) => (
                      <View key={field.name} className={group.length === 2 ? "flex-1" : ""}>
                        <Text className="text-slate-600 font-medium mb-1">
                          {field.label}
                        </Text>
                        {renderMetaField(field)}
                      </View>
                    ))}
                  </View>
                ))}

              {activeTab === "ATTACHMENTS" && (
                <MediaUploader
                  endpoints={{rename:"",share:"",tree:"files/tree",upload:"files/upload-base64",zip:""}}
                  prospectId={id as string}
                />
              )}
            </View>
          ) : (
            <View
              className="flex-1 bg-white rounded-lg p-4"
              style={{ minWidth: 300 }}
            >
              {[
                { key: "name", label: "First Name *" },
                { key: "lastName", label: "Last Name" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" },
                { key: "address", label: "Address" },
                { key: "city", label: "City" },
                { key: "state", label: "State/Province" },
              ].map(({ key, label }) => (
                <View key={key} className="mb-4">
                  <Text className="text-slate-600 font-medium mb-1">{label}</Text>
                  <TextInput
                    className={`border border-slate-300 rounded-md px-4 py-2 bg-white ${
                      errors[key as keyof FormData] ? "border-red-500" : ""
                    }`}
                    placeholder={`Enter ${label}`}
                    value={formData[key as keyof FormData]}
                    onChangeText={(text) =>
                      handleStaticChange(key as keyof FormData, text)
                    }
                    editable={!isViewing && !isLoading}
                    multiline={key === "address"}
                    style={
                      key === "address" ? { height: 80, textAlignVertical: "top" } : undefined
                    }
                  />
                  {errors[key as keyof FormData] && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors[key as keyof FormData]}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          className={`${
            isViewing ? "bg-slate-500" : "bg-emerald-500"
          } rounded-md py-3 items-center mt-4`}
          onPress={() => {
            if (isViewing) {
              router.back();
            } else {
              handleSubmit();
            }
          }}
          disabled={isLoading}
        >
          <Text className="text-white font-semibold text-lg">
            {isViewing
              ? "Back"
              : isLoading
              ? "Processing..."
              : isEditing
              ? "Update Client"
              : "Create Client"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ClientForm;
