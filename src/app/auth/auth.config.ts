import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
              authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_AfYsJ9kdF',
              redirectUrl: window.location.origin,
              postLogoutRedirectUri: window.location.origin,
              clientId: '7dod9puab9tdvpmml3g25fbqfr',
              scope: 'phone openid email', // 'openid profile offline_access ' + your scopes
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
          }
}
