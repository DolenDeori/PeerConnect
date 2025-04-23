import onboarding1 from "@/assets/images/onboarding1.png";
import onboarding2 from "@/assets/images/onboarding2.png";
import onboarding3 from "@/assets/images/onboarding3.png";
import check from "@/assets/images/check.png";
import icon from "@/assets/images/icon.png";

import google_icon from "@/assets/icons/google.png";
import avatar_1 from "@/assets/images/profile_image_1.png";
import avatar_2 from "@/assets/images/profile_image_2.png";
import send_package from "@/assets/icons/send_package.png";
import traveling_package from "@/assets/icons/traveling_package.png";
import my_package from "@/assets/icons/my_package.png";
import my_delivery from "@/assets/icons/my_delivery.png";

import {
  Package,
  PackageCheck,
  MapPinCheckInside,
  Wallet,
  Settings,
  Truck,
  MessagesSquare,
  Gift,
  CircleHelp,
} from "lucide-react-native";

export const icons = {
  google_icon,
  send_package,
  traveling_package,
  my_package,
};

export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
  icon,
  check,
  avatar_1,
  avatar_2,
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

export const swiperImages = [
  {
    id: 1,
    uri: "https://images.unsplash.com/photo-1694395998892-5225e95b8a47?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    uri: "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    uri: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export const homeMenuItems = [
  {
    title: "Send Package",
    subtitle: "Ship your parcels with us",
    icon: send_package, // Replace with your local asset or use an Image URI
    url: "/(root)/(sender)/multistep/step1",
  },
  {
    title: "Travelling",
    subtitle: "Earn money by delivering packages",
    icon: traveling_package,
    url: "/(root)/(traveler)/traveler",
  },
  {
    title: "My Packages",
    subtitle: "See your listed packages",
    icon: my_package,
    url: "/(root)/track-package",
  },
  {
    title: "My Deliveries",
    subtitle: "See your listed deliveries",
    icon: my_delivery,
    url: "/(root)/(sender)/multistep/step1",
  },
];

export const homeSidebarMenuLinks = [
  {
    id: "main",
    items: [
      {
        label: "Send Package",
        icon: Package,
        link: "/(root)/(sender)/multistep/step1",
      },
      {
        label: "Deliver Package",
        icon: Truck,
        link: "/(root)/(traveler)/traveler",
      },
      { label: "My Packages", icon: PackageCheck, link: "/track-package" },
      { label: "My Deliveries", icon: MapPinCheckInside, link: "" },
    ],
  },
  {
    id: "finance",
    items: [
      { label: "Rewards", icon: Gift, link: "" },
      { label: "My Earnings", icon: Wallet, link: "" },
    ],
  },
  {
    id: "account",
    items: [
      { label: "Settings", icon: Settings, link: "" },
      { label: "Help", icon: CircleHelp, link: "" },
      { label: "Contact Us", icon: MessagesSquare, link: "" },
    ],
  },
];
