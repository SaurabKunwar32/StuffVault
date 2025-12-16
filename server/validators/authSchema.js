import * as z from "zod";

export const loginSchema = z.object({
    email: z.email("Please enter a valid email !!"),
    password: z.string(),
});

export const registerSchema = loginSchema.extend({
    name: z.string()
        .min(3, "Name must be at least 3 characters long.")
        .max(100, "Name cannot exceed 100 characters."),
    otp: z
        .string('Please enter a valid 4 digit OTP')
        .regex(/^\d{4}$/, "Please enter a valid 4 digit OTP"),
});

export const verifyotpSchema = z.object({
    email: z.email("Please enter a valid email !!"),
    otp: z
        .string('Please enter a valid 4 digit OTP')
        .regex(/^\d{4}$/, "Please enter a valid 4 digit OTP"),
})

export const googleLoginSchema = z.object({
    idToken: z
        .string()
        .min(1, "Google ID token is required"),
});

export const githubCallbackSchema = z.object({
    code: z.string("Code did not match !!").min(1, "Code is required"),
});

export const sendOtpSchema = z.object({
    email: z
        .string("Email is required")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"),
});


export const renameDirectorySchema = z.object({
    newDirName: z
        .string("Directory name is required")
        .min(1, "Directory name cannot be empty")
        .max(100, "Directory name is too long")
        .regex(
            /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/,
            "Directory name can contain single spaces between words only (no leading, trailing, or multiple spaces)"
        ),
});

export const renameFileSchema = z.object({
    newFilename: z
        .string({ required_error: "File name is required" })
        .min(1, "File name cannot be empty")
        .regex(
            /^(?!\.)(?!.*\s{2,})(?!.*\.$)[A-Za-z0-9][A-Za-z0-9 _-]*(?:\.[A-Za-z0-9]+)+$/,
            "Invalid file name. Must include a valid name and extension (e.g. 'my file.png')."
        ),
});

export const changeUserRoleSchema = z.object({
    userId: z
        .string("User ID is required")
        .regex(/^[a-f\d]{24}$/i, "Invalid user ID format"),
    role: z.enum(["User", "Admin", "Owner", "Manager"], {
        required_error: "Role is required",
    }),
});

export const updateNameSchema = z.object({
    newName: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(1, "Name cannot be empty")
        .max(100, "Name is too long")
});

export const changePasswordSchema = z.object({
    currentPassword: z
        .string({ required_error: "Current password is required" })
        .min(4, "Current password must be at least 4 characters long")
        .refine((val) => val.trim().length > 0, "Current password cannot be only spaces")
        .refine(
            (val) => !/^\s|\s$/.test(val),
            "Current password cannot start or end with a space"
        ),

    newPassword: z
        .string({ required_error: "New password is required" })
        .min(4, "New password must be at least 4 characters long")
        .refine((val) => val.trim().length > 0, "New password cannot be only spaces")
        .refine(
            (val) => !/^\s|\s$/.test(val),
            "New password cannot start or end with a space"
        ),
});

export const setPasswordSchema = z.object({
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(4, "Password must be at least 4 characters long")
    .refine((val) => val.trim().length > 0, "Password cannot be only spaces")
    .refine((val) => !/^\s|\s$/.test(val), "Password cannot start or end with a space")
});