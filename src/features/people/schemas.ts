import { z } from "zod";

export const organizationSchema = z.object({ name: z.string().trim().min(2, "Name must be at least 2 characters."), code: z.string().trim().min(2, "Code is required.").max(20), description: z.string().trim().max(500).optional(), status: z.enum(["ACTIVE", "INACTIVE"]) });
export const departmentSchema = organizationSchema.extend({ organization_id: z.string().uuid("Select an organization.") });
export const employeeSchema = z.object({
  organization_id: z.string().uuid("Select an organization."), employee_code: z.string().trim().min(2, "Employee code is required."),
  first_name: z.string().trim().min(2, "First name is required."), last_name: z.string().trim().min(2, "Last name is required."),
  email: z.string().trim().email("Enter a valid email."), phone: z.string().trim().max(30).optional(), date_of_birth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY"]).optional(), date_of_joining: z.string().min(1, "Date of joining is required."),
  department_id: z.string().uuid("Select a department."), designation_id: z.string().uuid("Select a designation."), manager_id: z.string().uuid().optional().or(z.literal("")),
  employment_type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]), status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]),
});
export type EmployeeFormData = z.infer<typeof employeeSchema>;