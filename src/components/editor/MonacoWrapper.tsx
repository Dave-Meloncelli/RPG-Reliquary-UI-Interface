import React, { useState } from "react";

interface MonacoWrapperProps {
  path: string;
  defaultValue: string;
  onChange?: (value: string) => void;
}

// Simple textarea stub for Monaco Editor
const MonacoWrapper: React.FC<MonacoWrapperProps> = ({
  path,
  defaultValue,
  onChange,
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-2">
      <div className="text-xs text-gray-400 mb-2">
        Editing: {path} (Monaco Editor Stub)
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        className="w-full h-full bg-gray-800 text-white font-mono text-sm p-2 border-0 resize-none focus:outline-none"
        style={{ fontFamily: "Consolas, Monaco, Courier New, monospace" }}
        spellCheck={false}
      />
    </div>
  );
};

export default MonacoWrapper;
