import { z } from "zod";

export const customerInfoSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
  createAccount: z.boolean().optional(),
});
export type CustomerInfoValues = z.infer<typeof customerInfoSchema>;

export const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
  country: z.string().min(1, "Country is required"),
  province: z.string().min(1, "Province/State is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().optional(),
  street: z.string().min(1, "Street address is required"),
  postalCode: z.string().optional(),
});
export type AddressValues = z.infer<typeof addressSchema>;

export const paymentSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("card"),
    cardNumber: z.string().min(12, "Enter a valid card number"),
    cardName: z.string().min(1, "Name on card is required"),
    expiry: z.string().min(4, "Enter expiry as MM/YY"),
    cvv: z.string().min(3, "Enter a valid CVV"),
  }),
  z.object({ method: z.literal("mobile-money"), phoneNumber: z.string().min(7, "Enter a valid phone number") }),
  z.object({ method: z.literal("paypal") }),
  z.object({ method: z.literal("bank") }),
]);
export type PaymentValues = z.infer<typeof paymentSchema>;
