import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import check from "@/assets/images/check.png";
import icon from "@/assets/images/icon.png";

import google_icon from "@/assets/icons/google.png";
// import lock from "@/assets/icons/lock.png";

export const icons = {
  google_icon,
  // lock,
};

export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
  icon,
  check,
};

export const onboarding = [
  {
    id: 1,
    title: "Welcome to Peer Connect!",
    description:
      "Send and receive packages with ease by connecting with travelers already heading your way.",
    image: images.onboarding1,
  },
  {
    id: 2,
    title: "Earn While You Travel",
    description:
      "Turn your daily commute into an opportunity—deliver packages and get rewarded effortlessly.",
    image: images.onboarding2,
  },
  {
    id: 3,
    title: "Secure & Reliable",
    description:
      "Track your deliveries in real time and communicate with senders for a smooth, hassle-free experience.",
    image: images.onboarding3,
  },
];

// Dropdown options
export const dropdownOptions = {
  packageType: [
    { label: "Regular Package", value: "regular" },
    { label: "Express Package", value: "express" },
    { label: "Fragile Package", value: "fragile" },
  ],
  packageSize: [
    { label: "Small (up to 30x30x30 cm)", value: "small" },
    { label: "Medium (up to 50x50x50 cm)", value: "medium" },
    { label: "Large (up to 100x100x100 cm)", value: "large" },
  ],
  packageWeight: [
    { label: "Light (1-5 kg)", value: "1-5" },
    { label: "Medium (5-10 kg)", value: "5-10" },
    { label: "Heavy (10-20 kg)", value: "10-20" },
  ],
  packageContent: [
    { label: "Clothes", value: "clothes" },
    { label: "Electronics", value: "electronics" },
    { label: "Documents", value: "documents" },
    { label: "Books", value: "books" },
  ],
  waitingPeriod: [
    { label: "1-2 days", value: "1-2" },
    { label: "3-5 days", value: "3-5" },
    { label: "1 week", value: "7" },
  ],
};
