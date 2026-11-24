export const msalConfig = {
  auth: {
    clientId: "c1e8ff34-f485-4fb5-8e39-69a97e6a46df",
    // Al usar 'common', Microsoft permite cuentas de cualquier institución (como Duoc UC)
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "User.Read"],
};

export const protectedResources = {
  api: {
    endpoint: "http://localhost:4000",
    scopes: ["api://c1e8ff34-f485-4fb5-8e39-69a97e6a46df/access_as_user"],
  },
};