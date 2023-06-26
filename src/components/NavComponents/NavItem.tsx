import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import tw from "../../util/tailwind";
import Ionicons from "@expo/vector-icons/Ionicons";

interface props {
  index: number;
  href: string;
  name: string;
  selectedPos: number;
  setSelectedPos: (idx: number) => {};
}

export default function NavItem({
  index,
  href,
  selectedPos,
  setSelectedPos,
}: props) {
  const router = useRouter();

  const navigateTo = (href: string) => {
    setSelectedPos(index);
    router.push(href);
  };

  return (
    <TouchableOpacity
      style={tw`flex-1 flex-col justify-end items-center pb-1`}
      onPress={() => navigateTo(href)}
    >
      <Ionicons
        name={`${selectedPos === 0 ? "home" : "home-outline"}`}
        color={"#60a5fa"}
        size={27}
      />
    </TouchableOpacity>
  );
}
