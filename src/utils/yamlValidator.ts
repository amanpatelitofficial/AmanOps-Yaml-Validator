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
    
    // Basic automatic corrections
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

// Enhanced AI-powered YAML correction
export const aiCorrectYaml = (input: string): string => {
  try {
    // Step 1: Apply a series of common corrections
    let corrected = input
      // Fix indentation issues
      .replace(/\t/g, "  ") // Replace tabs with 2 spaces
      .replace(/^(\s*\w+):\s*$/gm, "$1: ") // Add space after keys with no value
      
      // Fix quote issues
      .replace(/:\s*'([^']*)'/g, ': "$1"') // Standardize to double quotes
      .replace(/:\s*([^"'\s][^,\s]*[:])/g, ': "$1"') // Quote values containing colons
      
      // Fix array syntax
      .replace(/^(\s*)-([^\s])/gm, "$1- $2") // Ensure space after dash in lists
      
      // Fix common alignment issues
      .replace(/^(\s*)(\w+):\n(?!\s)/gm, "$1$2:\n  ") // Add indent after key with newline
      
      // Fix missing quotes for special values
      .replace(/:\s*(yes|no|true|false|null|on|off)$/gim, (match, value) => {
        return ': ' + value.toLowerCase(); // Ensure boolean/null values are proper
      })
      
      // Fix trailing commas
      .replace(/,\s*$/gm, "");
    
    // Step 2: Try to parse corrected YAML
    try {
      const parsed = yaml.load(corrected);
      
      // Step 3: If successful, return properly formatted YAML
      return yaml.dump(parsed, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
        forceQuotes: false,
      });
    } catch (parseError) {
      // Step 4: Try line-by-line correction if parsing failed
      const lines = corrected.split("\n");
      const correctedLines = [];
      let inList = false;
      let currentIndent = 0;
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Skip empty lines
        if (line.trim() === '') {
          correctedLines.push(line);
          continue;
        }
        
        // Handle indentation consistency
        const indent = line.search(/\S/);
        if (indent > -1) {
          // Keep track of list items
          if (line.trim().startsWith('- ')) {
            inList = true;
            
            // Ensure list items align properly
            if (i > 0 && !lines[i-1].trim().startsWith('- ') && !lines[i-1].includes(':')) {
              line = ' '.repeat(currentIndent + 2) + line.trim();
            }
          } else if (line.includes(':')) {
            // This is a key
            inList = false;
            currentIndent = indent;
          } else if (inList && !line.trim().startsWith('- ')) {
            // Content belonging to a list item
            line = ' '.repeat(currentIndent + 4) + line.trim();
          }
        }
        
        correctedLines.push(line);
      }
      
      return correctedLines.join('\n');
    }
  } catch (e) {
    console.error("Error in aiCorrectYaml:", e);
    return input; // Return original input if all correction attempts fail
  }
};
