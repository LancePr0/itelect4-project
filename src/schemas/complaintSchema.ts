// src/schemas/complaintSchema.ts
// One schema. The rules live here, and the TypeScript type is DERIVED
// from it -- so a rule and its type can never drift apart.
import { z } from "zod";

export const complaintSchema = z.object({
  // The select starts on an empty option, so an unpicked tricycle is
  // caught here rather than arriving at the API as tricycleId: "".
  tricycleId: z.string().min(1, "Pick a tricycle."),
  complainantName: z.string().min(1, "Enter the complainant's name."),
  issueDescription: z.string().min(1, "Describe the issue."),
});

// z.infer reads the schema and hands back the TypeScript type. Written
// by hand, that type would be a second thing to keep in sync.
export type ComplaintFormValues = z.infer<typeof complaintSchema>;
