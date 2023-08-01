import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import PostImage from "../../src/components/postImage";
import tw from "../../src/util/tailwind";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../src/types/supabaseClient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CreatePostSelectionType } from "../../src/types/createPostSelectionType";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigateBackButton from "../../src/components/navigateBackButton";
import { maxDescriptionCharLen } from "../../src/util/postConstraints";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
import { selectUserId } from "../../src/redux/slices/profileSlice";
import { v4 as uuid } from "uuid";

export default function CreatePost() {
  const router = useRouter();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const userId = useSelector((state: RootState) => selectUserId(state));

  const { selectionType } = useLocalSearchParams();

  useEffect(() => {
    switch (selectionType) {
      case CreatePostSelectionType.camera: {
        openCamera();
        break;
      }
      case CreatePostSelectionType.gallery: {
        openGallery();
        break;
      }
    }
  }, []);

  async function openCamera() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) setImage(result.assets[0]);
    else if (result.canceled) navigateBack();
  }

  async function openGallery() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) setImage(result.assets[0]);
    else if (result.canceled) navigateBack();
  }

  async function navigateBack() {
    router.back();
  }

  async function uploadImage() {
    if (!image || !image.base64) return;
    setIsUploading(true);

    const { data, error } = await supabase.storage
      .from("images")
      .upload(`${userId}/${uuid()}`, image.base64!, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) console.warn("ERROR UPLOADING IMAGE:", error);

    const response = await supabase.from("posts").insert({
      description: description,
      image_url: data!.path,
      user_id: userId,
    });
    if (response.error) console.warn("ERROR INSERTING POST:", response.error);

    navigateBack();
  }

  function onDescriptionChange(text: string) {
    setDescription(text);
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* Header */}
      <View style={tw`pr-3 pl-1 py-3 flex-row justify-between items-center`}>
        <View style={tw`flex-row items-center`}>
          <NavigateBackButton onBackPress={navigateBack} />
          <Text
            style={[
              tw`text-lg  text-dark-gray`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            CREATE
          </Text>
        </View>

        <TouchableOpacity onPress={uploadImage}>
          <Text
            style={[
              tw`text-lg  text-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            POST
          </Text>
        </TouchableOpacity>
      </View>
      {/* Content Image */}
      <PostImage uri={image?.uri ?? ""} />

      {/* Description */}
      <Text
        style={[
          tw`pl-3 pt-2 text-base text-primary`,
          { fontFamily: "RobotoCondensed" },
        ]}
      >
        Description
      </Text>
      <TextInput
        style={[
          tw`bg-transparent rounded-sm text-base mx-3 my-2 flex-wrap flex-1`,
          { fontFamily: "RobotoCondensed" },
        ]}
        maxLength={maxDescriptionCharLen}
        onChangeText={onDescriptionChange}
        editable={!isUploading}
      />
    </SafeAreaView>
  );
}
