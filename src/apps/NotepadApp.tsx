import React, { useState } from "react";

const NotepadApp: React.FC = () => {
  const [content, setContent] = useState(
    "Welcome to Notepad!\n\nThis is a simple text editor. You can type whatever you want here.",
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
        className="w-full h-full p-4 bg-white text-gray-900 font-serif text-base resize-none focus:outline-none rounded-b-lg"
        aria-label="Notepad content"
      />
    </div>
  );
};

export default NotepadApp;
