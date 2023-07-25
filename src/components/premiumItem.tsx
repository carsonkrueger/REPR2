import { View, Text } from "react-native";
import tw from "../util/tailwind";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import CustomColors from "../util/customColors";

interface props {
  text: string;
}

export default function PremiumItem({ text }: props) {
  return (
    <View style={tw`flex-row items-center`}>
      <Feather
        name="check"
        color={CustomColors.primary}
        style={tw`p-[1px] mr-2 bg-front rounded-full`}
        size={16}
      />
      <Text
        style={[
          [
            tw`text-white text-center py-1 text-lg`,
            { fontFamily: "RobotoCondensed" },
          ],
        ]}
      >
        {text}
      </Text>
    </View>
  );
}
