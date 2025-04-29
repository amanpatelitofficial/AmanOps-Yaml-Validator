
import { useState } from "react";
import { Bot, Code } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { aiCorrectYaml } from "../utils/yamlValidator";

interface AiYamlAssistantProps {
  isInvalid: boolean;
  yamlContent: string;
  onApplyCorrection: (correctedYaml: string) => void;
}

const AiYamlAssistant = ({ isInvalid, yamlContent, onApplyCorrection }: AiYamlAssistantProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const generateCorrection = () => {
    setIsGenerating(true);
    
    try {
      // Process the YAML with our AI correction algorithm
      const corrected = aiCorrectYaml(yamlContent);
      setAiSuggestion(corrected);
    } catch (error) {
      console.error("Error generating correction:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = () => {
    onApplyCorrection(aiSuggestion);
    setAiSuggestion("");
  };

  if (!isInvalid) return null;

  return (
    <Card className="mt-4 p-4 border-amber-300 bg-amber-50">
      <div className="flex items-start space-x-4">
        <div className="bg-amber-100 p-2 rounded-full">
          <Bot className="h-6 w-6 text-amber-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-amber-800 mb-2">AI YAML Assistant</h3>
          
          {!aiSuggestion ? (
            <div>
              <p className="text-sm text-amber-700 mb-3">
                Your YAML has syntax errors. Would you like AI to attempt to fix it?
              </p>
              <Button
                variant="outline" 
                size="sm"
                className="bg-amber-200 border-amber-300 text-amber-800 hover:bg-amber-300"
                onClick={generateCorrection}
                disabled={isGenerating}
              >
                <Code className="mr-1 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Correction"}
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-amber-700 mb-2">AI generated a correction for your YAML:</p>
              <pre className="bg-amber-100 p-2 rounded text-xs text-amber-800 max-h-40 overflow-y-auto mb-3">
                {aiSuggestion}
              </pre>
              <div className="flex space-x-2">
                <Button
                  variant="outline" 
                  size="sm"
                  className="bg-amber-200 border-amber-300 text-amber-800 hover:bg-amber-300"
                  onClick={applySuggestion}
                >
                  Apply Correction
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  className="bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
                  onClick={() => setAiSuggestion("")}
                >
                  Discard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AiYamlAssistant;
