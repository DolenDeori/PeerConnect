import { View, Text } from "react-native";
import React, { useMemo } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const PackageHistory = () => {
  const snapPoints = useMemo(() => ["25%", "50%", "70%"], []);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  React.useEffect(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <GestureHandlerRootView>
      <View>
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
          <View>
            <Text>Hello I am a Bottom Sheet</Text>
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default PackageHistory;
