
import * as yaml from "js-yaml";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  correctedYaml: string;
}

export const validateYaml = (input: string): ValidationResult => {
  if (!input || input.trim() === "") {
    return {
      isValid: false,
      errors: ["YAML cannot be empty"],
      correctedYaml: "",
    };
  }

  try {
    // Try to parse the YAML
    const parsed = yaml.load(input);
    
    // If successful, dump it back to YAML format
    const formatted = yaml.dump(parsed, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
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
      .replace(/\s*:\s*$/gm, ":") // Fix trailing colons
      .replace(/^(\s*)-\s*([^\s])/gm, "$1- $2"); // Ensure space after list markers
    
    try {
      // Try to parse the corrected YAML to see if our fixes worked
      const testParse = yaml.load(correctedYaml);
      const betterFormatted = yaml.dump(testParse, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
      });
      
      // If we get here, our correction worked
      return {
        isValid: false,
        errors: [errorMessage],
        correctedYaml: betterFormatted,
      };
    } catch (secondError) {
      // Our automatic correction didn't work
      return {
        isValid: false,
        errors: [errorMessage],
        correctedYaml: correctedYaml,
      };
    }
  }
};
