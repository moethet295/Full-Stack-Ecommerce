import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { Package } from "lucide-react";

interface ProductStatusCardProps {
  title: string;
  iconColor?: string;
  isLoading: boolean;
  value: number;
}

function ProductStatus({
  title,
  iconColor = "text-muted-foreground",
  isLoading,
  value,
}: ProductStatusCardProps) {
  return (
    <Card>
      {/* ========================= */}
      {/* CARD HEADER */}
      {/* ========================= */}

      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>

        <Package
          className={`h-4 w-4 ${iconColor}`}
        />
      </CardHeader>

      {/* ========================= */}
      {/* CARD CONTENT */}
      {/* ========================= */}

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">
            {value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ProductStatus;