import { useState, useCallback } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const useScrolled = (threshold: number = 10) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      setIsScrolled(offsetY > threshold);
    },
    [threshold]
  );

  return { isScrolled, onScroll: handleScroll };
};

export default useScrolled;
