import React, { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const CustomBottomSheet = ({
  snapPoints,
  children,
}: {
  snapPoints: string[];
  children: React.ReactNode;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints || ["25%", "50%"]}
      index={0}
      keyboardBehavior="extend"
      enablePanDownToClose={true}
    >
      {children}
    </BottomSheet>
  );
};

export default CustomBottomSheet;
