import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import tw from "../util/tailwind";

interface props {
  onOutOfBoundsClick?: () => void;
  safeCommand: () => void;
  safeText: string;
  children: React.ReactNode;
}

const MyAlert = ({
  onOutOfBoundsClick,
  safeCommand,
  safeText,
  children,
}: props) => {
  return (
    <TouchableWithoutFeedback onPress={onOutOfBoundsClick}>
      <View
        style={tw`z-100 absolute top-0 right-0 bottom-0 left-0 bg-transparent justify-center items-center`}
      >
        <TouchableWithoutFeedback>
          <View
            style={tw`rounded-lg justify-between bg-front px-4 py-5 max-h-64 max-w-128 h-[25%] w-[85%]`}
          >
            <View style={tw`justify-center items-center my-auto`}>
              {children}
            </View>

            <View style={tw`flex-row justify-evenly items-center`}>
              <TouchableOpacity
                style={tw`rounded-md bg-primary px-2 py-1 shadow-sm`}
                onPress={safeCommand}
              >
                <Text
                  style={[
                    tw`text-white text-center text-base`,
                    { fontFamily: "RobotoCondensed" },
                  ]}
                >
                  {safeText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MyAlert;
