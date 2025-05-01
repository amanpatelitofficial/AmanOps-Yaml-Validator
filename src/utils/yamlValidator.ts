
import * as yaml from "js-yaml";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  correctedYaml: string;
}

export const validateYaml = (yamlContent: string): ValidationResult => {
  try {
    // Try to parse the YAML
    const parsedYaml = yaml.load(yamlContent);
    
    // If no error is thrown, it's valid
    return {
      isValid: true,
      errors: [],
      correctedYaml: yamlContent,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      isValid: false,
      errors: [errorMessage],
      correctedYaml: "",
    };
  }
};
