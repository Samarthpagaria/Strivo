import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const UmamiTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.umami) {
      window.umami.track();
    }
  }, [location.pathname]);

  return null;
};

export default UmamiTracker;
