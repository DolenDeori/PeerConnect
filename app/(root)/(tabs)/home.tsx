import CustomButton from "@/components/customButton";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const [text, setText] = useState("This is Home Page");
  const onButtonPress = () => {
    setText("This is Home Page After Clicking Button");
  };
  return (
    <SafeAreaView>
      <View>
        <Text>{text}</Text>
      </View>
      <View>
        <CustomButton />
      </View>
    </SafeAreaView>
  );
};

export default Home;
