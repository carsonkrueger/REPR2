import {
  InputModeOptions,
  StyleProp,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import tw from "../util/tailwind";

interface props {
  style?: StyleProp<TextStyle>;
  inputMode?: InputModeOptions;
  placeholder?: string;
  placeholderTextColor?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  rightItem?: JSX.Element;
  leftItem?: JSX.Element;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function FormInput({
  style,
  inputMode,
  placeholder,
  placeholderTextColor,
  onChangeText,
  editable,
  leftItem,
  rightItem,
  secureTextEntry,
  autoCapitalize,
}: props) {
  return (
    <View
      style={[
        style,
        tw`py-1 px-2 flex-row rounded-full items-center bg-front shadow-sm overflow-hidden`,
      ]}
    >
      {leftItem}
      <TextInput
        style={[
          tw`flex-1 px-2 py-1 text-lg text-primary selection:bg-primary`,
          { fontFamily: "RobotoCondensed" },
        ]}
        inputMode={inputMode}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onChangeText={onChangeText}
        editable={editable}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
      />
      {rightItem}
    </View>
  );
}
