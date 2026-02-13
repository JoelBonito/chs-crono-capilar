import { z } from "zod";

export const PRODUCT_TYPES = ["hydration", "nutrition", "reconstruction"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const PRODUCT_STATUSES = ["in_use", "depleted", "replaced"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

// Default consumption per session (ml)
export const DEFAULT_USAGE_PER_SESSION_ML = 15;

// Low stock threshold: remaining sessions
export const LOW_STOCK_THRESHOLD_SESSIONS = 2;

// Request schema for registerProduct endpoint
export const registerProductRequestSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).max(200),
  type: z.enum(PRODUCT_TYPES),
  totalVolumeMl: z.number().int().positive().max(5000),
  usagePerSessionMl: z.number().int().positive().max(500).default(DEFAULT_USAGE_PER_SESSION_ML),
});

export type RegisterProductRequest = z.infer<typeof registerProductRequestSchema>;

// Firestore document shape
export interface ProductDocument {
  id: string;
  userId: string;
  name: string;
  type: ProductType;
  totalVolumeMl: number;
  usagePerSessionMl: number;
  sessionsCompleted: number;
  remainingMl: number;
  estimatedDepletion: FirebaseFirestore.Timestamp | null;
  lowStock: boolean;
  status: ProductStatus;
  createdAt: FirebaseFirestore.FieldValue;
  updatedAt: FirebaseFirestore.FieldValue;
}
