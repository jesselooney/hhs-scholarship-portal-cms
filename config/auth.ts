import * as jose from "jose";

export default ({ env }) => {
  const requireEnv: (variableName: string) => string = (variableName) => {
    const value = env(variableName);
    if (value) {
      return value;
    } else {
      throw Error(`${variableName} must be set`);
    }
  };

  const alg = requireEnv("AUTH_JWT_ALGORITHM");
  const pkcs8 = requireEnv("AUTH_JWT_PKCS8_PEM");
  const spki = requireEnv("AUTH_JWT_SPKI_PEM");
  const secretKey = jose.importPKCS8(pkcs8, alg);
  const publicKey = jose.importSPKI(spki, alg);

  return {
    alg,
    secretKey,
    publicKey,
    lifetime: requireEnv("AUTH_JWT_LIFETIME"),
    redirectUrl: requireEnv("AUTH_REDIRECT_URL"),
    tokenEndpointUrl: requireEnv("AUTH_TOKEN_ENDPOINT_URL"),
    clientId: requireEnv("AUTH_CLIENT_ID"),
    clientSecret: requireEnv("AUTH_CLIENT_SECRET"),
    rosterApplicationId: requireEnv("AUTH_ROSTER_APPLICATION_ID"),
    rosterAccessToken: requireEnv("AUTH_ROSTER_ACCESS_TOKEN")
  };
};
