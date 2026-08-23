"use client";

import { ChevronLeft, ChevronRight, Pencil, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { Employee } from "../types";

const DEBOUNCE_MS = 300;

export function EmployeeTable({
  employees,
  page,
  pageSize,
  total,
  filters,
  departments,
  designations,
}: {
  employees: Employee[];
  page: number;
  pageSize: number;
  total: number;
  filters: {
    search: string;
    departmentId?: string;
    designationId?: string;
    employmentType?: string;
    status?: string;
  };
  departments: { id: string; name: string }[];
  designations: { id: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localFilters, setLocalFilters] = useState<
    typeof filters & { page?: number }
  >(filters);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const buildSearchString = useCallback(
    (overrides: Partial<typeof localFilters> = {}) => {
      const merged = { ...localFilters, ...overrides };
      const values = new URLSearchParams(
        Object.entries(merged)
          .filter(([, value]) => value && value !== "")
          .map(([key, value]) => [key, String(value)])
      );
      return `/people/employees${values.toString() ? `?${values}` : ""}`;
    },
    [localFilters]
  );

  const handleFilterChange = useCallback(
    (key: keyof typeof localFilters, value: string) => {
      const newFilters = { ...localFilters, [key]: value };
      // Reset to page 1 when filters change
      newFilters.page = undefined;
      setLocalFilters(newFilters);

      // Clear existing timer
      if (debounceTimer) clearTimeout(debounceTimer);

      // Set new debounced navigation
      const timer = setTimeout(() => {
        router.push(buildSearchString(newFilters));
      }, DEBOUNCE_MS);

      setDebounceTimer(timer);
    },
    [localFilters, debounceTimer, router, buildSearchString]
  );

  const handleResetFilters = useCallback(() => {
    setLocalFilters({
      search: "",
      departmentId: "",
      designationId: "",
      employmentType: "",
      status: "",
    });
    if (debounceTimer) clearTimeout(debounceTimer);
    router.push("/people/employees");
  }, [router, debounceTimer]);

  const hasActiveFilters = useMemo(
    () =>
      Object.entries(localFilters).some(
        ([key, value]) => key !== "page" && key !== "pageSize" && value
      ),
    [localFilters]
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    router.push(`/people/employees?${params}`);
  };

  return (
    <>
      <div className="grid gap-3 border-b bg-[#fbfcfd] p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative lg:col-span-2">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={localFilters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search name, code, or email"
            className="h-10 w-full rounded-md border bg-white pl-9 pr-3 text-sm outline-none focus:border-[var(--teal)]"
          />
        </div>

        <select
          value={localFilters.departmentId || ""}
          onChange={(e) => handleFilterChange("departmentId", e.target.value)}
          className="h-10 rounded-md border bg-white px-3 text-sm text-slate-600"
        >
          <option value="">All departments</option>
          {departments.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={localFilters.designationId || ""}
          onChange={(e) => handleFilterChange("designationId", e.target.value)}
          className="h-10 rounded-md border bg-white px-3 text-sm text-slate-600"
        >
          <option value="">All designations</option>
          {designations.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={localFilters.employmentType || ""}
          onChange={(e) => handleFilterChange("employmentType", e.target.value)}
          className="h-10 rounded-md border bg-white px-3 text-sm text-slate-600"
        >
          <option value="">All types</option>
          <option value="FULL_TIME">Full time</option>
          <option value="PART_TIME">Part time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERN">Intern</option>
        </select>

        <select
          value={localFilters.status || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="h-10 rounded-md border bg-white px-3 text-sm text-slate-600"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ON_LEAVE">On leave</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <X size={16} />
            Clear filters
          </button>
        )}
      </div>

      {employees.length === 0 ? (
        <div className="p-14 text-center">
          <p className="text-sm font-semibold text-slate-600">
            No employees found.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#f8fafc] text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Employee</th>
                <th className="px-5 py-3 font-semibold">Code</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Designation</th>
                <th className="px-5 py-3 font-semibold">Manager</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <Link
                      href={`/people/employees/${employee.id}`}
                      className="font-semibold text-[var(--navy)] hover:text-[var(--teal)]"
                    >
                      {employee.first_name} {employee.last_name}
                    </Link>
                    <span className="mt-0.5 block text-xs text-slate-400">
                      {employee.email}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {employee.employee_code}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {employee.department?.name ?? "-"}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {employee.designation?.name ?? "-"}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {employee.manager
                      ? `${employee.manager.first_name} ${employee.manager.last_name}`
                      : "-"}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {employee.employment_type.replace("_", " ")}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#e2f3f1] px-2.5 py-1 text-xs font-semibold text-[#07656d]">
                      {employee.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/people/employees/${employee.id}/edit`}
                      className="inline-flex rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-[var(--navy)]"
                      aria-label={`Edit ${employee.first_name}`}
                    >
                      <Pencil size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t p-4 text-xs text-slate-500">
        <span>
          {total === 0
            ? "0 results"
            : `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, total)} of ${total} results`}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className={`rounded-md border p-2 ${
              page <= 1
                ? "pointer-events-none opacity-40"
                : "hover:bg-slate-50"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={15} />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className={`rounded-md border p-2 ${
              page >= totalPages
                ? "pointer-events-none opacity-40"
                : "hover:bg-slate-50"
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
