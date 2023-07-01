import { Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootState } from "../../src/redux/store";
import tw from "../../src/util/tailwind";

export default function Profile() {
  return (
    <SafeAreaView style={tw`flex-1 bg-back`}>
      <View style={tw`py-2 bg-front shadow-md`}>
        <Text
          style={[
            tw`text-xl text-center text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          PROFILE
        </Text>
      </View>
    </SafeAreaView>
  );
}
