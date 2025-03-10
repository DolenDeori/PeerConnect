/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        DMSansRegular: ["DMSans-Regular", "sans-serif"],
        DMSansMedium: ["DMSans-Medium", "sans-serif"],
        DMSansSemiBold: ["DMSans-SemiBold", "sans-serif"],
        HostGorteskMedium: ["HostGrotesk-Medium", "sans-serif"],
        HostGorteskBold: ["HostGrotesk-Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
