import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import PostImage from "../../src/components/postComponents/postImage";
import tw from "../../src/util/tailwind";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CreatePostSelectionType } from "../../src/types/createPostSelectionType";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigateBackButton from "../../src/components/navigateBackButton";
import { maxDescriptionCharLen } from "../../src/util/postConstraints";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
import { selectUserId } from "../../src/redux/slices/profileSlice";
import { v4 as uuid } from "uuid";
import CustomColors from "../../src/util/customColors";
import { uploadToSupabase } from "../../src/util/uploadToSupabase";
import { supabase } from "../../src/types/supabaseClient";

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
        ImagePicker.getCameraPermissionsAsync();
        openCamera();
        break;
      }
      case CreatePostSelectionType.gallery: {
        ImagePicker.getMediaLibraryPermissionsAsync();
        openGallery();
        break;
      }
    }
  }, []);

  async function navigateBack() {
    router.back();
  }

  async function openCamera() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: false,
      base64: true,
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
      base64: true,
    });
    if (!result.canceled) setImage(result.assets[0]);
    else if (result.canceled) navigateBack();
  }

  function uploadImage() {
    if (!image) return;
    setIsUploading(true);
    const imageUuid = uuid();

    async function doUpload() {
      await supabase.from("posts").insert({
        user_id: userId,
        description: description !== "" ? description : null,
        content_id: imageUuid,
        content_type: 1,
      });
      await uploadToSupabase(
        image!.base64!,
        "images",
        `${userId}/${imageUuid}`,
        getFileExtensionType(image!.uri)
      );
    }
    doUpload();

    setIsUploading(false);
    navigateBack();
  }

  function onDescriptionChange(text: string) {
    setDescription(text);
  }

  function getFileExtensionType(filePath: string): string | undefined {
    return filePath.split(".").pop();
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* Header */}
      <View
        style={tw`pr-3 pl-1 py-3 mb-1 flex-row justify-between items-center shadow-md`}
      >
        {/* Left side */}
        <View style={tw`flex-row items-center`}>
          <NavigateBackButton
            onBackPress={navigateBack}
            disabled={isUploading}
          />
        </View>

        {/* Center */}
        <View
          style={tw`absolute flex-row left-0 right-0 justify-center items-center`}
        >
          <Text
            style={[
              tw`text-lg text-center text-dark-gray`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            NEW POST
          </Text>
        </View>

        {/* Right side */}
        <TouchableOpacity
          onPress={uploadImage}
          disabled={isUploading || !image}
        >
          <Text
            style={[
              tw`text-lg  text-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            Share
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Image */}
      <PostImage base64={image?.uri ?? undefined} />

      <View style={tw`flex-1`}>
        {/* Description */}
        <TextInput
          style={[
            tw`rounded-sm text-base mx-3 my-4 px-3 py-2 text-dark-gray min-h-14 max-h-full`,
            { fontFamily: "RobotoCondensed", textAlignVertical: "top" },
          ]}
          maxLength={maxDescriptionCharLen}
          onChangeText={onDescriptionChange}
          editable={!isUploading}
          placeholder="Write a caption..."
          placeholderTextColor={CustomColors["light-gray"]}
          numberOfLines={2}
          multiline={true}
          scrollEnabled={true}
        />
        <Text style={tw`absolute top-2 right-5 text-sm text-light-gray`}>
          {description.length === 0
            ? ""
            : `${description.length}/${maxDescriptionCharLen}`}
        </Text>
      </View>
    </SafeAreaView>
  );
}
