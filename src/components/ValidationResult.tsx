
import { Check, AlertTriangle } from "lucide-react";
import { Card } from "../components/ui/card";

interface ValidationResultProps {
  isValid: boolean;
  errors: string[];
  correctedYaml: string;
}

const ValidationResult = ({ isValid, errors, correctedYaml }: ValidationResultProps) => {
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
        <Card className="bg-red-50 border-none">
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
        <Card className="bg-blue-50 border-none">
          <div className="p-4">
            <h3 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
              <Check className="h-5 w-5" />
              Suggested Correction:
            </h3>
            <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded-lg border shadow-sm">
              {correctedYaml}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ValidationResult;
