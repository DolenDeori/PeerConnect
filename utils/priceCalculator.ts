// priceCalculator.ts

export type PackageSize = "small" | "medium" | "large";
export type ContentType = "general" | "fragile" | "perishable";

export interface PriceInput {
  distanceKm: number; // Required: Distance between pickup 
  packageSize: PackageSize;
  weightKg: number;
  contentType: ContentType;
}

// Constants for pricing logic
const BASE_RATE_PER_KM = 8;
const SIZE_SURCHARGE: Record<PackageSize, number> = {
  small: 5,
  medium: 20,
  large: 40,
};

const CONTENT_SURCHARGE: Record<ContentType, number> = {
  general: 5,
  fragile: 50,
  perishable: 30,
};

const WEIGHT_THRESHOLD_KG = 5;
const EXTRA_WEIGHT_RATE = 10; // per kg over threshold

export function calculateDeliveryPrice(input: PriceInput): number {
  const { distanceKm, packageSize, weightKg, contentType } = input;

  const baseRate = BASE_RATE_PER_KM;
  const sizeSurcharge = SIZE_SURCHARGE[packageSize];
  const contentSurcharge = CONTENT_SURCHARGE[contentType];

  const basePrice = distanceKm * baseRate;

  const weightSurcharge =
    weightKg > WEIGHT_THRESHOLD_KG
      ? (weightKg - WEIGHT_THRESHOLD_KG) * EXTRA_WEIGHT_RATE
      : 0;

  const totalPrice =
    basePrice + sizeSurcharge + contentSurcharge + weightSurcharge;

  console.log({
    distanceKm,
    packageSize,
    weightKg,
    contentType,
    price: totalPrice,
  });

  return Math.round(totalPrice);
}
