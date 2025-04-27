
import { Check, AlertTriangle } from "lucide-react";

interface ValidationResultProps {
  isValid: boolean;
  errors: string[];
  correctedYaml: string;
}

const ValidationResult = ({ isValid, errors, correctedYaml }: ValidationResultProps) => {
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg flex items-center gap-2 ${
        isValid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}>
        {isValid ? (
          <>
            <Check className="h-5 w-5" />
            <span>Valid YAML</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-5 w-5" />
            <span>Invalid YAML</span>
          </>
        )}
      </div>
      
      {!isValid && errors.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-medium text-red-700 mb-2">Errors Found:</h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {!isValid && correctedYaml && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-700 mb-2">Suggested Correction:</h3>
          <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded border">
            {correctedYaml}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ValidationResult;
