import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

type MediaUploaderProps = {
  endpoint: string;
  onUploaded?: (fileUrl: string) => void;
};

const MediaUploader = ({ endpoint, onUploaded }: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<{ uri: string; type: string }[]>([]);

  const handlePickMedia = async (mediaType: "image" | "video" | "audio") => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        mediaType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : mediaType === "video"
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.All, // Audio workaround
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      uploadFile(result.assets[0].uri, mediaType);
    }
  };

  const handleCaptureMedia = async (mediaType: "image" | "video") => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permission denied");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes:
        mediaType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      uploadFile(result.assets[0].uri, mediaType);
    }
  };

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });

    if (result.canceled) return;

    uploadFile(result.assets[0].uri, "document");
  };

  const uploadFile = async (uri: string, type: string) => {
    setUploading(true);
    const filename = uri.split("/").pop();
    const formData = new FormData();

    formData.append("file", {
      uri,
      name: filename,
      type: type === "image"
        ? "image/jpeg"
        : type === "video"
        ? "video/mp4"
        : type === "audio"
        ? "audio/mpeg"
        : "application/octet-stream",
    } as any);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.json();
      const fileUrl = data.url || data.fileUrl || uri; // Ajusta según tu backend

      setFiles((prev) => [...prev, { uri: fileUrl, type }]);
      onUploaded && onUploaded(fileUrl);
    } catch (error) {
      alert("Upload failed");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="p-2">

      <View className="flex-row flex-wrap gap-2">
        {/* Buttons */}
        <TouchableOpacity
          className="bg-emerald-500 px-4 py-2 rounded-md flex-row items-center"
          onPress={() => handlePickMedia("image")}
        >
          <Feather name="image" size={16} color="white" />
          <Text className="text-white ml-2">Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-emerald-500 px-4 py-2 rounded-md flex-row items-center"
          onPress={() => handleCaptureMedia("image")}
        >
          <Ionicons name="camera" size={16} color="white" />
          <Text className="text-white ml-2">Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-emerald-500 px-4 py-2 rounded-md flex-row items-center"
          onPress={() => handlePickMedia("video")}
        >
          <Ionicons name="videocam" size={16} color="white" />
          <Text className="text-white ml-2">Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-emerald-500 px-4 py-2 rounded-md flex-row items-center"
          onPress={() => handlePickDocument()}
        >
          <Feather name="file" size={16} color="white" />
          <Text className="text-white ml-2">Document</Text>
        </TouchableOpacity>
      </View>

      {/* Uploaded Files */}
      <View className="mt-4 flex-row flex-wrap gap-4">
        {files.map((file, index) => (
          <View key={index} className="w-[100px] h-[100px] bg-slate-100 rounded-md justify-center items-center">
            {file.type === "image" ? (
              <Image
                source={{ uri: file.uri }}
                className="w-full h-full rounded-md"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-xs text-center">{file.type.toUpperCase()}</Text>
            )}
          </View>
        ))}
      </View>

      {uploading && (
        <ActivityIndicator size="small" color="#10b981" className="mt-2" />
      )}
    </View>
  );
};

export default MediaUploader;
