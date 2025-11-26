"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getUrl } from "@/lib/api";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const chartConfig = {
  visits: {
    label: "Visits",
    color: "#ffffff",
  },
} satisfies ChartConfig;

export const AppLineChart = ({ code }: { code: string }) => {
  const [stats, setStats] = useState([]);
  const [isTrue, setIsTrue] = useState<boolean>(false);
  const theme = useTheme();
  const navigate = useRouter();

  useEffect(() => {
    const fn = async () => {
      const data = await getUrl(code);
      if (!data.data.success) {
        toast.error("No data found");
        return;
      }
      setIsTrue((p) => !p);
      setStats(data.data.stats);
    };
    fn();
  }, [code]);

  return (
    <>
      {isTrue ? (
        <>
          <ChartContainer config={chartConfig} className="mt-6">
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
                tickFormatter={(value) => value.slice(5)} // mm-dd
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="visits"
                type="monotone"
                stroke={theme.theme === "dark" ? "#cccccc" : "#111111"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </>
      ) : (
        <div className="flex gap-2 items-center justify-center">
          <p className="font-semibold text-base">No Url found</p>
          <Button
            onClick={() => {
              navigate.push("/");
            }}
            variant={"outline"}
          >
            Go back
          </Button>
        </div>
      )}
    </>
  );
};
