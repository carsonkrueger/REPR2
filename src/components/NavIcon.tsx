import { TouchableHighlight } from "react-native-gesture-handler";
import { StyleSheet, Text } from "react-native";
import { Link } from "expo-router";

interface props {
  href: string;
  name: string;
  icon?: React.ReactNode;
}

export default function NavIcon({ href, name, icon }: props) {
  return (
    <Link href={href}>
      <TouchableHighlight style={styles.container}>
        <Text>{name}</Text>
      </TouchableHighlight>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
});
