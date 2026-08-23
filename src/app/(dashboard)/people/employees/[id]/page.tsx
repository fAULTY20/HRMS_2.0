import { getEmployee } from "@/features/people/services";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: employee, error } = await getEmployee(id);

  if (error || !employee) notFound();

  // Helper to safely format manager name
  const getManagerName = () => {
    if (!employee.manager) return undefined;
    if (
      typeof employee.manager === "object" &&
      employee.manager.first_name &&
      employee.manager.last_name
    ) {
      return `${employee.manager.first_name} ${employee.manager.last_name}`;
    }
    return undefined;
  };

  return (
    <section className="mx-auto max-w-5xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[var(--teal)]">
            People / Employees
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--navy)]">
            {employee.first_name} {employee.last_name}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {employee.employee_code} · {employee.email}
          </p>
        </div>
        <Link
          href={`/people/employees/${id}/edit`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--navy)] px-4 text-sm font-semibold text-white hover:bg-[#1b4566]"
        >
          <Pencil size={16} /> Edit employee
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <InfoBlock title="Personal information">
          <Info label="Email" value={employee.email} />
          <Info label="Phone" value={employee.phone} />
          <Info label="Date of birth" value={employee.date_of_birth} />
          <Info
            label="Gender"
            value={employee.gender?.replaceAll("_", " ")}
          />
        </InfoBlock>

        <InfoBlock title="Employment information">
          <Info label="Employee code" value={employee.employee_code} />
          <Info label="Date of joining" value={employee.date_of_joining} />
          <Info label="Department" value={employee.department?.name} />
          <Info label="Designation" value={employee.designation?.name} />
          <Info
            label="Employment type"
            value={employee.employment_type.replaceAll("_", " ")}
          />
          <Info
            label="Status"
            value={employee.status.replaceAll("_", " ")}
          />
          <Info label="Manager" value={getManagerName()} />
        </InfoBlock>
      </div>
    </section>
  );
}

function InfoBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border bg-white p-6">
      <h2 className="mb-5 text-base font-bold text-[var(--navy)]">{title}</h2>
      <dl className="grid gap-4 sm:grid-cols-2">{children}</dl>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium capitalize text-slate-700">
        {value || "Not provided"}
      </dd>
    </div>
  );
}