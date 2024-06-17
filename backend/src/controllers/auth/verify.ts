import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../../types/user";
import { getUser, insertNewUser } from "../../services/dataSources/user/user";
config();

const DYNAMIC_PUBLIC_KEY_BASE64 = process.env.DYNAMIC_PUBLIC_KEY_BASE64;
if (!DYNAMIC_PUBLIC_KEY_BASE64)
  throw new Error("DYNAMIC_PUBLIC_KEY_BASE64 is not defined");

interface NameService {
  name: string;
}

interface VerifiedCredential {
  address?: string;
  chain: string;
  id: string;
  name_service: NameService;
  public_identifier: string;
  wallet_name: string;
  wallet_provider: string;
  format: "email" | "blockchain" | "oauth";
  email: string;
  embedded_wallet_id?: string | null;
}

interface JWTSessionData {
  kid: string;
  aud: string;
  iss: string;
  sub: string;
  sid: string;
  environment_id: string;
  lists: any[];
  missing_fields: any[];
  scope: string;
  verified_credentials: VerifiedCredential[];
  last_verified_credential_id: string;
  first_visit: string;
  last_visit: string;
  new_user: boolean;
  iat: number;
  exp: number;
  email: string;
}

const verifyAsync = (
  token: string,
  secretOrPublicKey: string
): Promise<JWTSessionData> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      if (!decoded) {
        return reject(new Error("No payload decoded"));
      }
      resolve(decoded as JWTSessionData);
    });
  });
};

export const verifyUser = async (
  authToken: string
): Promise<JWTSessionData> => {
  const publicKey = process.env.DYNAMIC_PUBLIC_KEY_BASE64
    ? Buffer.from(process.env.DYNAMIC_PUBLIC_KEY_BASE64, "base64").toString(
        "ascii"
      )
    : "";

  try {
    const data: JWTSessionData = await verifyAsync(authToken, publicKey);
    const email = data.email;
    const dynamicUserId = data.verified_credentials.filter(
      (x) => x.format === "oauth"
    )[0]?.id;
    console.log({ email, dynamicUserId });
    const existingUser = await getUser(dynamicUserId, dynamicUserId, email);
    console.log({ existingUser });
    let user: Partial<User> = {
      dynamic_user_id: dynamicUserId,
      email: email,
    };
    if (!existingUser || !existingUser?.user_id || !existingUser?.email) {
      const newUser = await insertNewUser(user);
      if (!newUser || "error" in newUser) {
        throw new Error(
          "User could not be created: " +
            (newUser && "error" in newUser ? newUser?.error : "")
        );
      }
      console.log({ newUser });
      if (newUser && newUser.user_id) {
        user = newUser;
      }
    } else {
      user = existingUser;
    }
    return data;
  } catch (e) {
    console.log(e);
    throw new Error("User authorization could not be verified");
  }
};
