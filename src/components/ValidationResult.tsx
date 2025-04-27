
import { Check, AlertTriangle } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface ValidationResultProps {
  isValid: boolean;
  errors: string[];
  correctedYaml: string;
}

const ValidationResult = ({ isValid, errors, correctedYaml }: ValidationResultProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg flex items-center gap-4 
        ${isValid 
          ? "bg-green-50 border-l-4 border-green-500 text-green-700" 
          : "bg-red-50 border-l-4 border-red-500 text-red-700"
        }`}
      >
        {isValid ? (
          <>
            <Check className="h-6 w-6 bg-green-500 text-white rounded-full p-1" />
            <span className="font-semibold">Valid YAML</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-6 w-6 bg-red-500 text-white rounded-full p-1" />
            <span className="font-semibold">Invalid YAML</span>
          </>
        )}
      </div>
      
      {!isValid && errors.length > 0 && (
        <Card className="bg-red-50 border-none shadow-sm">
          <div className="p-4">
            <h3 className="font-medium text-red-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Errors Found:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-red-600">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}
      
      {!isValid && correctedYaml && (
        <Card className="bg-blue-50 border-none shadow-sm">
          <div className="p-4">
            <h3 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
              <Check className="h-5 w-5" />
              Suggested Correction:
            </h3>
            <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded-lg border shadow-sm overflow-auto max-h-[200px]">
              {correctedYaml}
            </pre>
            {correctedYaml && (
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(correctedYaml)} 
                  className="bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                >
                  Copy Correction
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {isValid && correctedYaml && (
        <Card className="bg-green-50 border-none shadow-sm">
          <div className="p-4">
            <h3 className="font-medium text-green-700 mb-2 flex items-center gap-2">
              <Check className="h-5 w-5" />
              Formatted YAML:
            </h3>
            <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded-lg border shadow-sm overflow-auto max-h-[200px]">
              {correctedYaml}
            </pre>
            <div className="mt-3 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(correctedYaml)} 
                className="bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
              >
                Copy Formatted YAML
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ValidationResult;
