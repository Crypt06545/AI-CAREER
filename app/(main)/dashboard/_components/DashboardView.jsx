"use client";
import { LineChart, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

const DashboardView = ({ insights }) => {
  if (!insights || !insights.salaryRanges) {
    return <div className="text-red-500">No insights available</div>;
  }

  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook?.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const { icon: OutlookIcon, color: outlookColor } =
    getMarketOutlookInfo(insights.marketOutlook);

  const lastUpdatedDate = insights.updatedAt
    ? format(new Date(insights.updatedAt), "dd/MM/yyyy")
    : "Unknown";

  const nextUpdateDistance = insights.nextUpdate
    ? formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true })
    : "Unknown";

  return (
    <div>
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
        <div className={`flex items-center gap-2 ${outlookColor}`}>
          <OutlookIcon className="w-4 h-4" />
          <span>{insights.marketOutlook}</span>
        </div>
      </div>
      {/* You can render salaryData chart or details below */}
    </div>
  );
};

export default DashboardView;
