import { STATUS_SELECT_OPTIONS } from "@/lib/admin/content-status";

interface StatusSelectProps {
  id?: string;
  name?: string;
  defaultValue?: string | null;
  className: string;
}

export default function StatusSelect({
  id = "status",
  name = "status",
  defaultValue = "draft",
  className,
}: StatusSelectProps) {
  return (
    <select id={id} name={name} defaultValue={defaultValue ?? "draft"} className={className}>
      {STATUS_SELECT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
