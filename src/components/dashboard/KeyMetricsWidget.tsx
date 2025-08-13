import React, { useState, useEffect, type FC } from "react";

import type { ObservatoryMetrics } from "../../types";

const MetricDisplay: FC<{
  title: string;
  value: string;
  className?: string;
}> = ({ title, value, className = "" }) => (
  <div>
    <p className="text-sm text-slate-400 mb-1">{title}</p>
    <p className={`text-2xl font-bold font-mono ${className}`}>{value}</p>
  </div>
);

const KeyMetricsWidget: FC = () => {
  const [metrics, setMetrics] = useState<ObservatoryMetrics>({
    totalLLMCalls: 0,
    estimatedCost: 0,
    avgTaskDuration: 0,
  });

  useEffect(() => {
    const dataStream = streamObservabilityData();
    let isMounted = true;

    const processStream = async () => {
      for await (const data of dataStream) {
        if (!isMounted) break;
        setMetrics(data.metrics);
      }
    };

    processStream();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="h-full flex flex-col justify-between">
      <MetricDisplay
        title="Total LLM Calls"
        value={metrics.totalLLMCalls.toLocaleString()}
        className="text-cyan-400"
      />
      <MetricDisplay
        title="Estimated Cost"
        value={`$${metrics.estimatedCost.toFixed(4)}`}
        className="text-green-400"
      />
      <MetricDisplay
        title="Avg. Task Duration"
        value={`${metrics.avgTaskDuration.toFixed(0)} ms`}
        className="text-yellow-400"
      />
    </div>
  );
};

export default KeyMetricsWidget;
