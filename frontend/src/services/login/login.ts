import { JWTSessionData } from "@/types/auth";
import { User } from "@/types/user";
import dappApi, { API_EXPRESS_BASE_URL } from "@/utils/api/fetcher";

export const login = async (
  authToken: string
): Promise<
  | {
      status: "Authorized" | "Unauthorized";
      token: JWTSessionData;
    }
  | undefined
> => {
  try {
    const response = await fetch(`${API_EXPRESS_BASE_URL}/verify`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ authToken }),
    });

    const verification: {
      status: "Authorized" | "Unauthorized";
      token: JWTSessionData;
    } = await response.json();
    return verification;
  } catch (e) {
    console.log("error", e);
    return undefined;
  }
};

export async function requestUserData(
  userId: string
): Promise<User | undefined> {
  const response = await dappApi.get<{ data: { user: User } }>(
    `/user?user_id=${userId}`
  );
  if (response) {
    console.log({ response });
    return response?.data?.user;
  }
  return undefined;
}

export async function updateUserData(
  user: Partial<User>
): Promise<User | undefined> {
  const body = {
    user,
  };
  const response = await dappApi.post<{ data: { user: User } }>(`/user/save`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (response) {
    console.log('update user response', { response });
    return response?.data?.user;
  }
  return undefined;
}

export const authenticate = async (
  method: string,
  authToken?: string
): Promise<User | undefined> => {
  if (method === "POST" && authToken) {
    const authorized = await login(authToken);
    if (!authorized) {
      return;
    }
    if (authorized) {
      const dynamicUserId = authorized.token.verified_credentials.filter(
        (x) => x.format === "oauth"
      )[0]?.id;
      const verifiedUserRequest = await requestUserData(dynamicUserId);
      console.log({ verifiedUserRequest });
      return verifiedUserRequest;
    }
  }
  return;
};

export default login;
