
import { Editor } from "@monaco-editor/react";
import { useState } from "react";

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const YamlEditor = ({ value, onChange }: YamlEditorProps) => {
  return (
    <div className="h-[400px] w-full border rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="yaml"
        value={value}
        onChange={(value) => onChange(value || "")}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          renderLineHighlight: "all",
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default YamlEditor;
