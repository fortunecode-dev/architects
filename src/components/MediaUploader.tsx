import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, Image, ActivityIndicator,
  Alert, TextInput, Modal
} from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { SERVER_URL } from "@env";

type MediaUploaderProps = {
  prospectId: string;
  endpoints: {
    upload: string;
    tree: string;
    zip: string;
    rename: string;
    share: string;
  };
};

type TreeNode = {
  name: string;
  type: "folder" | "file";
  path: string;
  children?: TreeNode[];
};

const MediaUploader = ({ prospectId, endpoints }: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [renaming, setRenaming] = useState<{ path: string; name: string } | null>(null);
  const [share, setShare] = useState<{ path: string; type: "FILE" | "FOLDER" } | null>(null);
  const [emailToShare, setEmailToShare] = useState("");

  const fetchTree = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/${endpoints.tree}/${prospectId}`);
      setTree(res.data);
    } catch {
      Alert.alert("Error al obtener archivos");
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

 const pickFile = async (type: "image" | "video" | "document") => {
  try {
    let uri: string | null = null;

    if (type === "document") {
      const doc = await DocumentPicker.getDocumentAsync({ multiple: false });
      if (!doc.canceled) uri = doc.assets[0].uri;
    } else {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          type === "image"
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false,
        base64: false, // ✅ explícito
      });

      if (!res.canceled) uri = res.assets[0].uri;
    }

    if (uri) {
      // ✅ Corregimos base64 o content URIs
      if (!uri.startsWith("file://")) {
        const filename = uri.split("/").pop();
        const destPath = FileSystem.cacheDirectory + filename;
        await FileSystem.copyAsync({ from: uri, to: destPath });
        uri = destPath;
      }

      uploadFile(uri, type);
    }
  } catch (error) {
    console.error("Error en pickFile:", error);
    Alert.alert("Error", "No se pudo seleccionar el archivo");
  }
};


const uploadFile = async (uri: string, type: "image" | "video" | "document") => {
  try {
    setUploading(true);

    const filename = uri.split("/").pop() || `archivo.${type}`;
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64
    });

    const res = await fetch(`${SERVER_URL}/${endpoints.upload}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        base64,
        name: filename,
        type,
        prospectId
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error de backend:", errorText);
      throw new Error("Fallo al subir el archivo");
    }

    await fetchTree();
  } catch (err) {
    console.error("uploadFile error:", err);
    Alert.alert("Error", "No se pudo subir el archivo");
  } finally {
    setUploading(false);
  }
};



  const downloadZip = async () => {
    const zipUrl = `${endpoints.zip}?folder=${encodeURIComponent(prospectId)}`;
    const localUri = `${FileSystem.documentDirectory}${prospectId}.zip`;

    try {
      const { uri } = await FileSystem.downloadAsync(zipUrl, localUri);
      await Sharing.shareAsync(uri);
    } catch {
      Alert.alert("Error al descargar ZIP");
    }
  };

  const rename = async () => {
    if (!renaming) return;
    await axios.post(endpoints.rename, {
      oldPath: renaming.path,
      newName: renaming.name
    });
    setRenaming(null);
    fetchTree();
  };

  const sendShare = async () => {
    if (!share || !emailToShare) return;
    await axios.post(endpoints.share, {
      path: share.path,
      type: share.type,
      email: emailToShare
    });
    setShare(null);
    setEmailToShare("");
    Alert.alert("Enlace enviado");
  };

  const renderTree = (nodes: TreeNode[]) => {
    return nodes?.map((node) => (
      <View key={node.path} className="ml-2 mt-2">
        <View className="flex-row items-center gap-2">
          {node.type === "folder" ? (
            <Feather name="folder" size={16} />
          ) : (
            <Feather name="file" size={16} />
          )}
          <Text>{node.name}</Text>

          {/* Acciones */}
          <TouchableOpacity onPress={() => setRenaming({ path: node.path, name: node.name })}>
            <Feather name="edit" size={14} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShare({ path: node.path, type: node.type.toUpperCase() as any })}>
            <MaterialIcons name="share" size={16} />
          </TouchableOpacity>
        </View>

        {node.children && renderTree(node.children)}
      </View>
    ));
  };

  return (
    <View className="p-4">
      {/* Botones */}
      <View className="flex-row gap-2 flex-wrap mb-4">
        <TouchableOpacity onPress={() => pickFile("image")} className="bg-emerald-500 px-4 py-2 rounded-md flex-row items-center">
          <Feather name="image" size={16} color="white" />
          <Text className="text-white ml-2">Imagen</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => pickFile("video")} className="bg-emerald-500 px-4 py-2 rounded-md flex-row items-center">
          <Ionicons name="videocam" size={16} color="white" />
          <Text className="text-white ml-2">Video</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => pickFile("document")} className="bg-emerald-500 px-4 py-2 rounded-md flex-row items-center">
          <Feather name="file" size={16} color="white" />
          <Text className="text-white ml-2">Documento</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={downloadZip} className="bg-indigo-600 px-4 py-2 rounded-md flex-row items-center">
          <Feather name="download" size={16} color="white" />
          <Text className="text-white ml-2">Descargar ZIP</Text>
        </TouchableOpacity>
      </View>

      {/* Árbol de archivos */}
      <View>{renderTree(tree)}</View>

      {/* Loader */}
      {uploading && <ActivityIndicator className="mt-2" />}

      {/* Modal renombrar */}
      <Modal visible={!!renaming} transparent animationType="slide">
        <View className="bg-white p-4 rounded-md m-8">
          <Text className="mb-2">Renombrar archivo</Text>
          <TextInput
            value={renaming?.name}
            onChangeText={(text) => setRenaming((r) => r && { ...r, name: text })}
            className="border px-2 py-1 rounded"
          />
          <View className="flex-row justify-end gap-2 mt-2">
            <TouchableOpacity onPress={() => setRenaming(null)}><Text>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity onPress={rename}><Text className="text-blue-500">Guardar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal compartir */}
      <Modal visible={!!share} transparent animationType="slide">
        <View className="bg-white p-4 rounded-md m-8">
          <Text className="mb-2">Compartir {share?.type === "FOLDER" ? "carpeta" : "archivo"}</Text>
          <TextInput
            value={emailToShare}
            placeholder="email@ejemplo.com"
            onChangeText={setEmailToShare}
            className="border px-2 py-1 rounded"
          />
          <View className="flex-row justify-end gap-2 mt-2">
            <TouchableOpacity onPress={() => setShare(null)}><Text>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity onPress={sendShare}><Text className="text-blue-500">Compartir</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MediaUploader;
