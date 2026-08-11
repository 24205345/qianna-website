import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  actions?: ReactNode;
}

export default function AdminPageHeader({ title, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <h1 className="font-serif text-3xl text-stone-900">{title}</h1>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>
      ) : null}
    </div>
  );
}
