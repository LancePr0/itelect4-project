// src/schemas/complaintSchema.ts
// One schema. The rules live here, and the TypeScript type is DERIVED
// from it -- so a rule and its type can never drift apart.
import { z } from "zod";

export const complaintSchema = z.object({
  complainantName: z.string().min(1, "Enter the complainant's name."),
  violationType: z.string().min(1, "Describe the violation."),
  // Body numbers are painted digits, so anything else means a typo or
  // the wrong tricycle -- not something a plain "required" check catches.
  tricycleBodyNumber: z
    .string()
    .min(1, "Enter the tricycle's body number.")
    .refine((val) => /^\d+$/.test(val), "Body number must contain digits only."),
});

// z.infer reads the schema and hands back the TypeScript type:
//   { complainantName: string; violationType: string; tricycleBodyNumber: string }
// Written by hand, that type would be a second thing to keep in sync.
export type ComplaintFormValues = z.infer<typeof complaintSchema>;
