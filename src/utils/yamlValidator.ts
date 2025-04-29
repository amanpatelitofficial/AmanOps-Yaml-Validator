
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

// Intelligent YAML correction using common patterns and fixes
export const aiCorrectYaml = (input: string): string => {
  // Common YAML syntax errors and corrections
  let corrected = input
    // Fix indentation issues
    .replace(/^\s*(\w+):/gm, "$1:") // Remove leading spaces before keys
    .replace(/^(\s*\w+:)\s*(\w+.*)/gm, "$1 $2") // Ensure space after colon for inline values
    
    // Fix quote issues
    .replace(/:\s*([^,\s]*?)([,\s]|$)/gm, (match, p1, p2) => {
      // Add quotes to values that need them
      if (
        p1 &&
        !p1.startsWith('"') &&
        !p1.startsWith("'") &&
        (p1.includes(':') || p1.includes(' '))
      ) {
        return `: "${p1}"${p2}`;
      }
      return match;
    })
    
    // Fix array syntax
    .replace(/^(\s+)(\w+):\s*\[/gm, "$1$2:") // Convert inline arrays to multi-line
    .replace(/^\s*-\s*([^\s])/gm, "- $1") // Ensure space after dash in lists
    
    // Fix nested content alignment
    .replace(/^(\s*)(\w+):\n(\s*)/gm, (match, indent, key, nextIndent) => {
      if (nextIndent.length <= indent.length) {
        return `${indent}${key}:\n${indent}  `;
      }
      return match;
    });

  try {
    // If we can parse it as valid YAML, then format it properly
    const parsed = yaml.load(corrected);
    return yaml.dump(parsed, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
    });
  } catch (e) {
    // If we still can't parse it, return our best attempt
    return corrected;
  }
};
