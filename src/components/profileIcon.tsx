import { style } from "d3";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import tw from "../util/tailwind";

interface props {
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    radius?: number;
    onPress?: () => void;
}

export default function ProfileIcon({style, disabled, radius = 10, onPress}: props) {

    return <TouchableOpacity style={[tw`overflow-hidden rounded-full border-light-gray border-[1px] h-${radius} w-${radius}`, style]} disabled={disabled} onPress={onPress}>

    </TouchableOpacity>
}