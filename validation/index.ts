import { z } from "zod";

export const senderFromSchema = z.object({
  pickupLocation: z.string().min(1, { message: "Pickup location is required" }),
  deliveryLocation: z
    .string()
    .min(1, { message: "Delivery location is required" }),
  packageWeight: z.number().min(1, { message: "Package weight is required" }),
  packageDimensions: z
    .string()
    .min(1, { message: "Package dimensions are required" }),
  packageType: z.string().min(1, { message: "Package type is required" }),
  packageContent: z.string().min(1, { message: "Package content is required" }),
  packageDescription: z.string().optional(),
  ReceiverInfo: z.object({
    name: z.string().min(1, { message: "Receiver name is required" }),
    phone: z.string().min(1, { message: "Receiver phone is required" }),
    email: z.string().optional(),
    alternativePhone: z.string().optional(),
  }),
});

export type SenderFormData = z.infer<typeof senderFromSchema>;
