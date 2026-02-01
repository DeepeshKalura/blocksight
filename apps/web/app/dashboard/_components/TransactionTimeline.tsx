"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface TimelineDataPoint {
  date: string;
  volume: number;
  count: number;
  displayDate: string;
}

interface TransactionTimelineProps {
  data: TimelineDataPoint[];
  groupBy: "day" | "week" | "month";
  onGroupByChange: (groupBy: "day" | "week" | "month") => void;
}

export default function TransactionTimeline({
  data,
  groupBy,
  onGroupByChange,
}: TransactionTimelineProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No transaction data available</p>
        </CardContent>
      </Card>
    );
  }

  const displayData = data.slice(-30);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-muted-foreground">
              <span className="text-accent">{entry.name}:</span> {entry.value}
              {entry.dataKey === "volume" ? " ETH" : " transactions"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transaction Timeline</CardTitle>
          <Tabs value={groupBy} onValueChange={(v) => onGroupByChange(v as any)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-80">
            <ResponsiveContainer  width="100%" height="100%">
              <ComposedChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="displayDate" className="text-background" fontSize={12} />
                <YAxis yAxisId="volume" orientation="left" className="text-accent" fontSize={12} />
                <YAxis yAxisId="count" orientation="right" className="text-accent" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="volume" dataKey="volume" fill="#FFFFFF" name="Volume (ETH)" radius={[2, 2, 0, 0]} />
                <Line yAxisId="count" type="monotone" dataKey="count" stroke="hsl(var(--accent))" strokeWidth={2} name="Count" dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}