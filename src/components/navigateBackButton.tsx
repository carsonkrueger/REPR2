import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomColors from "../util/customColors";

interface props {
  onBackPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export default function NavigateBackButton({
  onBackPress,
  style,
  disabled = false,
}: props) {
  return (
    <TouchableOpacity style={style} onPress={onBackPress} disabled={disabled}>
      <Ionicons name="md-chevron-back" color={CustomColors.primary} size={30} />
    </TouchableOpacity>
  );
}
