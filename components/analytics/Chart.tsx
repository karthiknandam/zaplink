"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const chartConfig = {
  visits: {
    label: "Visits",
    color: "#ffffff",
  },
} satisfies ChartConfig;

type stats = { date: string; visits: number };

export const AppLineChart = ({ stats }: { stats: stats[] }) => {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const navigation = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {stats.length > 0 ? (
        <div>
          {mounted ? (
            <ChartContainer
              config={chartConfig}
              className="mt-6"
              suppressHydrationWarning
            >
              <LineChart
                accessibilityLayer
                data={stats}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="visits"
                  type="monotone"
                  stroke={theme.theme === "dark" ? "#cccccc" : "#111111"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div>Not mounted</div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 justify-center items-center">
          <h3 className="text-lg font-bold">No Analytics found</h3>
          <Button
            onClick={() => {
              navigation.push("/");
            }}
            variant={"outline"}
            className="w-fit"
          >
            Back
          </Button>
        </div>
      )}
    </>
  );
};
