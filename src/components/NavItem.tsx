import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";

interface props {
  href: string;
  name: string;
  icon?: React.ReactNode;
}

export default function NavItem({ href, name, icon }: props) {
  const router = useRouter();

  const navigateTo = () => {
    router.push(href);
  };

  return (
    <TouchableOpacity
      style={tw`flex-1 flex-col justify-end items-center`}
      onPress={navigateTo}
    >
      <Text style={tw`text-[${Colors.lightGray}] text-xs`}>{name}</Text>
    </TouchableOpacity>
  );
}

const Colors = {
  lightGray: "#cccccc",
  mediumGray: "#a8a8a8",
  darkGray: "#919191",
};
