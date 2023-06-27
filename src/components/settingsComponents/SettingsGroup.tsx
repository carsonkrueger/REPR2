import { View, Text } from "react-native";
import tw from "../../util/tailwind";

interface props {
  headerName: string;
  children: React.ReactNode;
}

const SettingsGroup = ({ headerName, children }: props) => {
  return (
    <View style={tw`mx-2 mt-2`}>
      <Text
        style={[
          tw`pb-2 pl-2 pt-2 text-light-gray`,
          { fontFamily: "RobotoCondensed" },
        ]}
      >
        {headerName}
      </Text>
      <View style={tw`bg-white p-1 rounded-md`}>{children}</View>
    </View>
  );
};

export default SettingsGroup;
