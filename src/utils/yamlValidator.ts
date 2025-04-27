
import * as yaml from "js-yaml";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  correctedYaml: string;
}

export const validateYaml = (input: string): ValidationResult => {
  try {
    // Try to parse the YAML
    const parsed = yaml.load(input);
    
    // If successful, dump it back to YAML format
    const formatted = yaml.dump(parsed, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });

    return {
      isValid: true,
      errors: [],
      correctedYaml: formatted,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Attempt to fix common YAML issues
    let correctedYaml = input
      .replace(/\t/g, "  ") // Replace tabs with spaces
      .replace(/:\s*([^\s])/g, ": $1") // Add space after colons
      .replace(/\s*:\s*$/gm, ":"); // Fix trailing colons
    
    return {
      isValid: false,
      errors: [errorMessage],
      correctedYaml,
    };
  }
};
