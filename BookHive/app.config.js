import "dotenv/config";

export default {
  expo: {
    name: "BookHive",
    slug: "BookHive",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/splash.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/splash.png",
        backgroundColor: "#ffffff",
      },
       "package": "com.anonymous.BookHive"
      
    },
    web: {
      favicon: "./assets/splash.png",
    },
    extra: {
      geminiAPIKey: process.env.GEMINI_API_KEY,
    },
  },
};
