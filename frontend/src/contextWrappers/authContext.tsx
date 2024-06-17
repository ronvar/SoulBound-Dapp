import { authenticate, updateUserData } from "@/services/login/login";
import { User } from "@/types/user";
import { createContext, useCallback, useEffect, useState } from "react";

type AuthState = {
  authenticated: undefined | boolean;
  setAuthenticated: (authenticated: boolean) => void;
  loading: boolean;
  signIn: (authToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  saveUser: (user: Partial<User>) => Promise<void>;
  user: undefined | User;
  setUser: (partialUser: User) => void;
  refreshUser: () => Promise<void>;
};

const authState: AuthState = {
  authenticated: undefined,
  setAuthenticated: (authenticated: boolean) => {},
  loading: true,
  signIn: (authToken: string) => Promise.resolve(),
  signOut: () => Promise.resolve(),
  saveUser: (partialUser: Partial<User>) => Promise.resolve(),
  user: {
    user_id: "",
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    wallet_address: "",
    dynamic_user_id: "",
    email: "",
  },
  setUser: (user: User) => {},
  refreshUser: () => Promise.resolve(),
};

export const AuthContext: React.Context<AuthState> = createContext(authState);

/* Handles authentication and user data */
export const AuthProvider = ({ children }: any) => {
  const [authenticated, setAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("user updated", user);
  }, [user]);

  const signIn = useCallback(async (authToken: string) => {
    try {
      const authPost = await authenticate("POST", authToken);
      if (!!authPost?.dynamic_user_id && !!authPost?.email) {
        setAuthenticated(true);
        setUser(authPost);
        // save the auth token in local storage and have it expire every 24 hours
        localStorage.setItem("soulBoundDappAuth", authToken);
        localStorage.setItem("soulBoundDappAuthTime", new Date().toISOString());
      } else {
        console.log("resetting user");
        setAuthenticated(false);
        setUser({
          user_id: "",
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
          wallet_address: "",
          dynamic_user_id: "",
          email: "",
        });
      }
      return;
    } catch (ex) {
      console.error("error trying to sign in", ex);
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log("signOut");
    console.log("resetting user 2");
    setAuthenticated(false);
    setUser({
      user_id: "",
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      wallet_address: "",
      dynamic_user_id: "",
      email: "",
    });
    localStorage.removeItem("soulBoundDappAuth");
    localStorage.removeItem("soulBoundDappAuthTime");
  }, []);

  const saveUser = useCallback(
    async (partialUser: Partial<User>) => {
      try {
        if (!user) {
          console.error("No user to save");
          return;
        }

        const updatedUser = { ...user, ...partialUser };
        const refreshedUser = await updateUserData(updatedUser);

        if (
          refreshedUser &&
          refreshedUser.dynamic_user_id === user.dynamic_user_id
        ) {
          setUser(refreshedUser);
        }
      } catch (error) {
        console.error("Error saving user", error);
      }
    },
    [user]
  );

  const refreshUser = useCallback(async () => {}, []);
  return (
    <AuthContext.Provider
      value={{
        authenticated,
        saveUser,
        setAuthenticated,
        signIn,
        signOut,
        user,
        setUser,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
