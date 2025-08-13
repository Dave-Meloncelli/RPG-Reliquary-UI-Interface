import React, { type FC, type ReactNode } from "react";

interface WidgetWrapperProps {
  title: string;
  gridArea: string;
  children: ReactNode;
}

const WidgetWrapper: FC<WidgetWrapperProps> = ({
  title,
  gridArea,
  children,
}) => (
  <div
    className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 flex flex-col"
    style={{ gridArea }}
  >
    <h3 className="text-md font-bold text-indigo-300 mb-3 flex-shrink-0">
      {title}
    </h3>
    <div className="flex-grow min-h-0">{children}</div>
  </div>
);

export default WidgetWrapper;
