import { z } from "zod";

export const senderFormSchema = z.object({
  pickupLocation: z.object({
    address: z.string().min(1, { message: "Pickup address is required" }),
    city: z.string().min(1, { message: "Pickup city is required" }),
    state: z.string().min(1, { message: "Pickup state is required" }),
    zipCode: z.string().min(1, { message: "Pickup zip code is required" }),
    longitude: z.number().optional(),
    latitude: z.number().optional(),
  }),
  deliveryLocation: z.object({
    address: z.string().min(1, { message: "Delivery address is required" }),
    city: z.string().min(1, { message: "Delivery city is required" }),
    state: z.string().min(1, { message: "Delivery state is required" }),
    zipCode: z.string().min(1, { message: "Delivery zip code is required" }),
    longitude: z.number().optional(),
    latitude: z.number().optional(),
  }),
  packageWeight: z.string().min(1, { message: "Package weight is required" }),
  packageDimensions: z
    .string()
    .min(1, { message: "Package dimensions are required" }),
  packageType: z.string().min(1, { message: "Package type is required" }),
  packageContent: z.string().min(1, { message: "Package content is required" }),
  packageDescription: z.string().optional(),
  receiverInfo: z.object({
    name: z.string().min(1, { message: "Receiver name is required" }),
    phone: z.string().min(1, { message: "Receiver phone is required" }),
    email: z.string().optional(),
    alternativePhone: z.string().optional(),
  }),
});

export type SenderFormData = z.infer<typeof senderFormSchema>;
