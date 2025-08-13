import React, { useState, type FC } from "react";

import type { FileSystemNode } from "../../data/fileSystemData";

interface FileExplorerProps {
  node: FileSystemNode;
  onFileSelect: (path: string, name: string) => void;
  basePath: string;
}

const FileOrFolder: FC<FileExplorerProps & { depth: number }> = ({
  node,
  onFileSelect,
  basePath,
  depth,
}) => {
  const [isOpen, setIsOpen] = useState(depth < 2); // Auto-expand first few levels
  const isDirectory = !!node.children;
  const currentPath = basePath ? `${basePath}/${node.name}` : node.name;

  const handleToggle = () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(currentPath, node.name);
    }
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        className="w-full text-left flex items-center gap-2 hover:bg-indigo-500/20 p-1 rounded"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {isDirectory ? (
          <span>{isOpen ? "▼" : "►"}</span>
        ) : (
          <span className="w-4"></span> // Spacer for alignment
        )}
        <span>{node.name}</span>
      </button>
      {isDirectory && isOpen && (
        <div>
          {node.children?.map((child) => (
            <FileOrFolder
              key={child.name}
              node={child}
              onFileSelect={onFileSelect}
              basePath={currentPath}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: FC<FileExplorerProps> = ({
  node,
  onFileSelect,
  basePath,
}) => {
  // We only want to render the children of the root 'root' node.
  return (
    <div className="p-2 text-sm">
      {node.children?.map((child) => (
        <FileOrFolder
          key={child.name}
          node={child}
          onFileSelect={onFileSelect}
          basePath=""
          depth={0}
        />
      ))}
    </div>
  );
};

export default FileExplorer;
