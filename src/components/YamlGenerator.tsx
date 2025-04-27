
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import * as yaml from "js-yaml";
import { Plus } from "lucide-react";

interface KeyValuePair {
  key: string;
  value: string;
}

const YamlGenerator = ({ onGenerate }: { onGenerate: (yaml: string) => void }) => {
  const [pairs, setPairs] = useState<KeyValuePair[]>([{ key: "", value: "" }]);

  const addPair = () => {
    setPairs([...pairs, { key: "", value: "" }]);
  };

  const updatePair = (index: number, field: "key" | "value", value: string) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
  };

  const generateYaml = () => {
    const obj = pairs.reduce((acc, { key, value }) => {
      if (key) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    const generated = yaml.dump(obj);
    onGenerate(generated);
  };

  return (
    <div className="space-y-4">
      {pairs.map((pair, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder="Key"
            value={pair.key}
            onChange={(e) => updatePair(index, "key", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={pair.value}
            onChange={(e) => updatePair(index, "value", e.target.value)}
            className="flex-1"
          />
        </div>
      ))}
      <div className="flex gap-2">
        <Button
          onClick={addPair}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </Button>
        <Button 
          onClick={generateYaml}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 
            hover:from-purple-600 hover:to-indigo-700"
        >
          Generate YAML
        </Button>
      </div>
    </div>
  );
};

export default YamlGenerator;
