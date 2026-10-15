// src/schemas/authSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("That is not an email address."),

  // Eight is not a number picked here. itelect4-backend's User schema
  // says minlength: 8, so a shorter one is refused by the database
  // rules anyway -- this only moves the message to where it is typed.
  password: z.string().min(8, "At least 8 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// .extend() adds to a schema instead of repeating it. The register
// route wants the same email and password plus a name, so the two
// rules above are written once and used by both forms.
export const registerSchema = loginSchema.extend({
  name: z.string().min(1, "Your name is required."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
