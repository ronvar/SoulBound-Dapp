import { useMediaQuery } from "@mantine/hooks";
import { useState, useEffect } from "react";

/* Handles screen size and device type */
const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isSmallDesktop, setIsSmallDesktop] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  const mobile = useMediaQuery("(max-width: 499px)");
  const tablet = useMediaQuery("(min-width: 500px) and (max-width: 899px)");
  const smallDesktop = useMediaQuery(
    "(min-width: 900px) and (max-width: 1699px)"
  );
  const desktop = useMediaQuery("(min-width: 1700px)");

  const resetAll = () => {
    setIsMobile(false);
    setIsTablet(false);
    setIsSmallDesktop(false);
    setIsDesktop(false);
  };

  useEffect(() => {
    const updateDeviceType = () => {
      resetAll();
      if (mobile) {
        setIsMobile(true);
      } else if (tablet) {
        setIsTablet(true);
      } else if (smallDesktop) {
        setIsSmallDesktop(true);
      } else if (desktop) {
        setIsDesktop(true);
      }
    };

    updateDeviceType();

    window.addEventListener("resize", updateDeviceType);
    return () => {
      window.removeEventListener("resize", updateDeviceType);
    };
  }, [mobile, tablet, smallDesktop, desktop]);

  return { isMobile, isTablet, isSmallDesktop, isDesktop };
};

export default useScreenSize;
