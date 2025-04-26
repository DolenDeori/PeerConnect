// priceCalculator.ts

export type TravelMedium =
  | "foot"
  | "bike"
  | "car"
  | "train"
  | "public_transport";
export type PackageSize = "small" | "medium" | "large" | "extraLarge";
export type ContentType = "general" | "fragile" | "perishable";

export interface PriceInput {
  distanceKm: number; // Required: Distance between pickup and delivery
  travelMedium: TravelMedium; // Transport medium
  packageSize: PackageSize; // Size category of the package
  weightKg: number; // Package weight in kilograms
  contentType: ContentType; // Type of content
}

// Constants for pricing logic
const BASE_RATE_PER_KM: Record<TravelMedium, number> = {
  foot: 2,
  bike: 5,
  car: 8,
  train: 6,
  public_transport: 4,
};

const SIZE_SURCHARGE: Record<PackageSize, number> = {
  small: 0,
  medium: 20,
  large: 40,
  extraLarge: 80,
};

const CONTENT_SURCHARGE: Record<ContentType, number> = {
  general: 0,
  fragile: 50,
  perishable: 30,
};

const WEIGHT_THRESHOLD_KG = 5;
const EXTRA_WEIGHT_RATE = 10; // per kg over threshold

export function calculateDeliveryPrice(input: PriceInput): number {
  const { distanceKm, travelMedium, packageSize, weightKg, contentType } =
    input;

  const baseRate = BASE_RATE_PER_KM[travelMedium];
  const sizeSurcharge = SIZE_SURCHARGE[packageSize];
  const contentSurcharge = CONTENT_SURCHARGE[contentType];

  const basePrice = distanceKm * baseRate;

  const weightSurcharge =
    weightKg > WEIGHT_THRESHOLD_KG
      ? (weightKg - WEIGHT_THRESHOLD_KG) * EXTRA_WEIGHT_RATE
      : 0;

  const totalPrice =
    basePrice + sizeSurcharge + contentSurcharge + weightSurcharge;

  return Math.round(totalPrice);
}
