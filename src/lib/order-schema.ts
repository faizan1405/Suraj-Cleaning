import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email address"),
  address: z.string().min(5, "Please enter your complete address"),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(1, "Select your state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  landmark: z.string().optional(),
  orderNotes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];
