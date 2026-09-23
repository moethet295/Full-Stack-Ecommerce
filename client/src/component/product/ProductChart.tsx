import type { Product } from "@/types/product";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

// =====================================
// PROPS
// =====================================

interface ProductChartProps {
  products: Product[];
}

// =====================================
// CHART DATA TYPE
// =====================================

interface ProductChartData {
  category: string;
  products: number;
}

// =====================================
// CHART CONFIG
// =====================================

const chartConfig = {
  products: {
    label: "Products",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// =====================================
// COMPONENT
// =====================================

function ProductChart({
  products,
}: ProductChartProps) {

  // =====================================
  // CATEGORY COUNT
  // =====================================

  const categoryMap: Record<string, number> = {};

  products.forEach((product: Product) => {
    const category: string =
      product.category || "Other";

    if (categoryMap[category]) {
      categoryMap[category] += 1;
    } else {
      categoryMap[category] = 1;
    }
  });

  // =====================================
  // CHART DATA
  // =====================================

  const chartData: ProductChartData[] = [];

  for (const category in categoryMap) {
    chartData.push({
      category: category,
      products: categoryMap[category],
    });
  }

  // =====================================
  // SORT HIGHEST -> LOWEST
  // =====================================

  chartData.sort(
    (
      a: ProductChartData,
      b: ProductChartData
    ) => {
      return b.products - a.products;
    }
  );

  // =====================================
  // RETURN
  // =====================================

  return (
    <Card className="h-full">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <CardHeader>

        <CardTitle>
          Products by Category
        </CardTitle>

        <CardDescription>
          Product distribution across categories
        </CardDescription>

      </CardHeader>

      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <CardContent>

        {chartData.length > 0 ? (

          <ChartContainer
            config={chartConfig}
            className="
              min-h-75
              w-full
            "
          >

            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -10,
                bottom: 5,
              }}
            >

              {/* ========================= */}
              {/* GRID */}
              {/* ========================= */}

              <CartesianGrid
                vertical={false}
              />

              {/* ========================= */}
              {/* X AXIS */}
              {/* ========================= */}

              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(
                  value: string
                ) => {
                  if (value.length > 10) {
                    return `${value.slice(
                      0,
                      10
                    )}...`;
                  }

                  return value;
                }}
              />

              {/* ========================= */}
              {/* Y AXIS */}
              {/* ========================= */}

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              {/* ========================= */}
              {/* TOOLTIP */}
              {/* ========================= */}

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent />
                }
              />

              {/* ========================= */}
              {/* BAR */}
              {/* ========================= */}

              <Bar
                dataKey="products"
                fill="var(--color-products)"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              />

            </BarChart>

          </ChartContainer>

        ) : (

          // =================================
          // EMPTY STATE
          // =================================

          <div
            className="
              flex
              min-h-75
              items-center
              justify-center
            "
          >

            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              No product data available.
            </p>

          </div>

        )}

      </CardContent>

    </Card>
  );
}

export default ProductChart;