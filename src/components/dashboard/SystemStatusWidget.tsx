import React, { useState, useEffect, type FC } from "react";

import type { SystemStatus } from "../../types";

const StatusMeter: FC<{ label: string; value: number; colorClass: string }> = ({
  label,
  value,
  colorClass,
}) => (
  <div>
    <div className="flex justify-between items-center mb-1 text-sm">
      <span className="font-semibold text-slate-300">{label}</span>
      <span
        className={`font-mono font-bold ${colorClass.replace("bg-", "text-")}`}
      >
        {value.toFixed(0)}%
      </span>
    </div>
    <div className="w-full bg-slate-700/50 rounded-full h-2.5">
      <div
        className={`${colorClass} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const SystemStatusWidget: FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    integrity: 100,
    threatLevel: 0,
  });

  useEffect(() => {
    const eventGenerator = streamErduEvents();
    let isMounted = true;
    const intervalId = setInterval(async () => {
      const { value } = await eventGenerator.next();
      if (isMounted && value) {
        setStatus(value.status);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const integrityColor =
    status.integrity > 70
      ? "bg-green-500"
      : status.integrity > 40
        ? "bg-yellow-500"
        : "bg-red-500";
  const threatColor =
    status.threatLevel > 70
      ? "bg-red-500"
      : status.threatLevel > 40
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className="h-full flex flex-col justify-center gap-6">
      <StatusMeter
        label="System Integrity"
        value={status.integrity}
        colorClass={integrityColor}
      />
      <StatusMeter
        label="Threat Level"
        value={status.threatLevel}
        colorClass={threatColor}
      />
    </div>
  );
};

export default SystemStatusWidget;
