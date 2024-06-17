export type NameService = {
    name: string;
  };
  
  export type VerifiedCredential = {
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
  };
  
  export type JWTSessionData = {
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
  };
  