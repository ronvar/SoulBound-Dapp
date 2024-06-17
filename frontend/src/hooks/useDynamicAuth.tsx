import { AuthContext } from "@/contextWrappers/authContext";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useCallback, useContext, useEffect } from "react";

/* Handles initial check of user's dynamic user id and email */
const useDyamicAuth = () => {
  const { user } = useContext(AuthContext);
  const { handleLogOut, isAuthenticated  } = useDynamicContext();

  const logout = useCallback(async () => {
    try {
      await handleLogOut();
    } catch (error) {
      console.error("Error during logout", error);
    }
  }, [handleLogOut]);

  // Check if user is logged in and has a dynamic user id at the start of the app
  useEffect(() => {
    if (!user?.dynamic_user_id && !user?.email && isAuthenticated) {
      console.log("logging out of dynamic sdk");
      logout();
    }
  }, []);

  return { logout };
};

export default useDyamicAuth;
