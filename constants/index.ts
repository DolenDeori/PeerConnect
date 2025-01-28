import splash from "@/assets/images/splash.png";
import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import google from "@/assets/icons/google.png";

export const images = {
  splash,
  onboarding1,
  onboarding2,
  onboarding3,
};

export const icons = {
  google,
};

export const onboarding = [
  {
    id: 1,
    title: "The perfect ride is just a tap away!",
    description:
      "Your journey begins with Ryde. Find your ideal ride effortlessly.",
    image: images.onboarding1,
  },
  {
    id: 2,
    title: "Best car in your hands with Ryde",
    description:
      "Discover the convenience of finding your perfect ride with Ryde",
    image: images.onboarding2,
  },
  {
    id: 3,
    title: "Your ride, your way. Let's go!",
    description:
      "Enter your destination, sit back, and let us take care of the rest.",
    image: images.onboarding3,
  },

];

export const data = {
  onboarding,
};


// Dropdown options
export const dropdownOptions = {
  packageType: [
    { label: 'Regular Package', value: 'regular' },
    { label: 'Express Package', value: 'express' },
    { label: 'Fragile Package', value: 'fragile' },
  ],
  packageSize: [
    { label: 'Small (up to 30x30x30 cm)', value: 'small' },
    { label: 'Medium (up to 50x50x50 cm)', value: 'medium' },
    { label: 'Large (up to 100x100x100 cm)', value: 'large' },
  ],
  packageWeight: [
    { label: 'Light (1-5 kg)', value: '1-5' },
    { label: 'Medium (5-10 kg)', value: '5-10' },
    { label: 'Heavy (10-20 kg)', value: '10-20' },
  ],
  packageContent: [
    { label: 'Clothes', value: 'clothes' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Documents', value: 'documents' },
    { label: 'Books', value: 'books' },
  ],
  waitingPeriod: [
    { label: '1-2 days', value: '1-2' },
    { label: '3-5 days', value: '3-5' },
    { label: '1 week', value: '7' },
  ],
};
