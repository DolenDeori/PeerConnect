module.exports = {
  expo: {
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
    plugins: [
      "expo-notifications",
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 33,
            targetSdkVersion: 33,
            buildToolsVersion: "33.0.0",
          },
        },
      ],
    ],
    android: {
      package: "com.dolendeori.peerconnect",
      googleServicesFile: "./google-services.json",
    },
  },
};
