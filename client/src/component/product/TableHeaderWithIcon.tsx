import type { LucideIcon } from "lucide-react";

interface TableHeaderWithIconProps {
  title: string;
  icon: LucideIcon;
}

function TableHeaderWithIcon({
  title,
  icon: Icon,
}: TableHeaderWithIconProps) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />

      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
    </div>
  );
}

export default TableHeaderWithIcon;