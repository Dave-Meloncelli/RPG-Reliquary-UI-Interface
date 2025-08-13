import React, { useState, useEffect, type FC } from "react";

import { loomService } from "../services/loomService";
import type { ScrollType, EditableScroll } from "../types";

const ScrollTypeSelector: FC<{
  onSelect: (type: ScrollType) => void;
  selectedType: ScrollType;
}> = ({ onSelect, selectedType }) => (
  <div className="flex flex-col gap-2">
    <button
      onClick={() => onSelect("playbook")}
      className={`w-full p-2 rounded-md text-sm font-bold transition-colors ${selectedType === "playbook" ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700"}`}
    >
      Playbooks
    </button>
    <button
      onClick={() => onSelect("codex")}
      className={`w-full p-2 rounded-md text-sm font-bold transition-colors ${selectedType === "codex" ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700"}`}
    >
      Codex Rules
    </button>
  </div>
);

const ScrollList: FC<{
  scrolls: EditableScroll[];
  onSelect: (id: any) => void;
  selectedId: any | null;
  onCreate: () => void;
}> = ({ scrolls, onSelect, selectedId, onCreate }) => (
  <div className="flex flex-col h-full">
    <ul className="flex-grow overflow-y-auto space-y-1">
      {scrolls.map((scroll) => (
        <li key={scroll.id}>
          <button
            onClick={() => onSelect(scroll.id)}
            className={`w-full text-left p-2 rounded text-sm transition-colors ${selectedId === scroll.id ? "bg-indigo-600/50" : "hover:bg-slate-700/50"}`}
          >
            <span className="truncate block">{scroll.name}</span>
          </button>
        </li>
      ))}
    </ul>
    <button
      onClick={onCreate}
      className="w-full mt-2 p-2 rounded-md bg-green-600/80 hover:bg-green-500/80 text-white font-bold text-sm transition-colors"
    >
      New...
    </button>
  </div>
);

const LoomApp: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ScrollType>("playbook");
  const [scrolls, setScrolls] = useState<EditableScroll[]>(
    loomService.getScrolls(selectedType),
  );
  const [selectedScroll, setSelectedScroll] = useState<EditableScroll | null>(
    null,
  );
  const [editorContent, setEditorContent] = useState("");
  const [editorName, setEditorName] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  useEffect(() => {
    const handleUpdate = () => {
      const updatedScrolls = loomService.getScrolls(selectedType);
      setScrolls(updatedScrolls);
      if (selectedScroll) {
        const stillExists = updatedScrolls.find(
          (s) => s.id === selectedScroll.id,
        );
        if (!stillExists) {
          setSelectedScroll(null);
          setEditorContent("");
          setEditorName("");
        }
      }
    };
    const unsubscribe = loomService.subscribe(handleUpdate);
    return unsubscribe;
  }, [selectedType, selectedScroll]);

  useEffect(() => {
    const newScrolls = loomService.getScrolls(selectedType);
    setScrolls(newScrolls);
    setSelectedScroll(null);
    setEditorContent("");
    setEditorName("");
  }, [selectedType]);

  useEffect(() => {
    if (selectedScroll) {
      setEditorContent(selectedScroll.content);
      setEditorName(selectedScroll.name);
    }
  }, [selectedScroll]);

  const handleSelectScroll = (id: any) => {
    const scroll = loomService.getScroll(id);
    setSelectedScroll(scroll || null);
  };

  const handleCreateScroll = () => {
    const newScroll = loomService.createScroll(selectedType);
    setSelectedScroll(newScroll);
  };

  const handleSave = () => {
    if (!selectedScroll) return;
    const success = loomService.updateScroll(
      selectedScroll.id,
      editorName,
      editorContent,
    );
    setSaveStatus(success ? "success" : "error");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleDelete = () => {
    if (
      selectedScroll &&
      window.confirm(
        `Are you sure you want to delete "${selectedScroll.name}"?`,
      )
    ) {
      loomService.deleteScroll(selectedScroll.id);
      setSelectedScroll(null);
      setEditorContent("");
      setEditorName("");
    }
  };

  const getSaveButtonClass = () => {
    switch (saveStatus) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      default:
        return "bg-indigo-600 hover:bg-indigo-500";
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/80 text-slate-200 font-sans">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-bold text-white">The Loom</h2>
        <p className="text-sm text-slate-400">
          Integrated editor for system scrolls (Playbooks, Codex Rules).
        </p>
      </div>
      <div className="flex-grow flex min-h-0">
        {/* Left Panel: File Tree */}
        <div className="w-1/6 min-w-[150px] p-2 bg-slate-900/50 border-r border-slate-700/50">
          <ScrollTypeSelector
            onSelect={setSelectedType}
            selectedType={selectedType}
          />
        </div>
        {/* Middle Panel: Scroll List */}
        <div className="w-1/4 min-w-[200px] p-2 bg-black/20 border-r border-slate-700/50">
          <ScrollList
            scrolls={scrolls}
            onSelect={handleSelectScroll}
            selectedId={selectedScroll?.id || null}
            onCreate={handleCreateScroll}
          />
        </div>
        {/* Right Panel: Editor */}
        <div className="flex-grow flex flex-col p-2">
          {selectedScroll ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={editorName}
                  onChange={(e) => setEditorName(e.target.value)}
                  className="flex-grow p-2 bg-slate-800 border border-slate-600 rounded-md font-semibold"
                />
                <button
                  onClick={handleSave}
                  className={`px-4 py-2 rounded-md text-white font-bold text-sm transition-colors ${getSaveButtonClass()}`}
                >
                  {saveStatus === "success"
                    ? "Saved!"
                    : saveStatus === "error"
                      ? "Invalid!"
                      : "Save"}
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-md bg-red-800/80 hover:bg-red-700/80 text-white transition-colors"
                  title="Delete Scroll"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="flex-grow w-full p-2 bg-black/30 rounded-md font-mono text-sm resize-none border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                spellCheck="false"
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Select a scroll to edit or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoomApp;
