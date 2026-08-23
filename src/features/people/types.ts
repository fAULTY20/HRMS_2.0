export type Status = "ACTIVE" | "INACTIVE";
export type EmployeeStatus = Status | "ON_LEAVE";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";

export type Organization = { id: string; name: string; code: string; description: string | null; status: Status; created_at: string; updated_at: string };
export type Department = { id: string; organization_id: string; name: string; code: string; description: string | null; status: Status; organization?: Pick<Organization, "name"> };
export type Designation = Department;
export type Employee = {
  id: string; organization_id: string; employee_code: string; first_name: string; last_name: string; email: string; phone: string | null;
  date_of_birth: string | null; gender: string | null; date_of_joining: string; department_id: string; designation_id: string;
  manager_id: string | null; employment_type: EmploymentType; status: EmployeeStatus; profile_image_url: string | null;
  department?: Pick<Department, "name">; designation?: Pick<Designation, "name">; manager?: Pick<Employee, "first_name" | "last_name"> | null;
};
export type EmployeeFilters = { search?: string; departmentId?: string; designationId?: string; employmentType?: EmploymentType; status?: EmployeeStatus; page?: number; pageSize?: number };