import { getToggleLabel } from "@/lib/admin/content-status";

interface VisibilityToggleFormProps {
  id: string;
  status: string;
  action: (id: string) => Promise<void>;
}

export default function VisibilityToggleForm({
  id,
  status,
  action,
}: VisibilityToggleFormProps) {
  return (
    <form action={action.bind(null, id)}>
      <button
        type="submit"
        className="text-stone-600 underline-offset-2 hover:underline"
        title={getToggleLabel(status)}
      >
        {getToggleLabel(status)}
      </button>
    </form>
  );
}
