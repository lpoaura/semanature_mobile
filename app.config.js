//import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, DEFAULT_USER_EMAIL, OBFUSCATED_DEFAULT_USER_PASSWORD} from '@env';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      firebaseApiKey: process.env.API_KEY,
      firebaseAuthDomain: process.env.AUTH_DOMAIN,
      firebaseProjectId: process.env.PROJECT_ID,
      firebaseStorageBucket: process.env.STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.MESSAGING_SENDER_ID,
      firebaseAppId: process.env.APP_ID,
      firebaseDefaultUserEmail: process.env.DEFAULT_USER_EMAIL,
      firebaseObfuscatedDefaultUserPassword: process.env.OBFUSCATED_DEFAULT_USER_PASSWORD,
      eas: {
        projectId: "b6a2a08d-0517-4e79-b4b1-fab12bd4ae25"
      }
    },
  };
};