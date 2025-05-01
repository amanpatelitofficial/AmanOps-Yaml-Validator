
import * as yaml from "js-yaml";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  correctedYaml: string;
}

export const validateYaml = (yamlContent: string): ValidationResult => {
  try {
    // Try to parse the YAML
    yaml.load(yamlContent);
    
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

export const aiCorrectYaml = (yamlContent: string): string => {
  try {
    // Try to parse the YAML first to see if it's valid
    yaml.load(yamlContent);
    return yamlContent; // If valid, just return as is
  } catch (error) {
    // If there's an error, attempt to fix common YAML issues
    let corrected = yamlContent;

    // Fix 1: Fix indentation issues (common in YAML)
    corrected = fixIndentation(corrected);

    // Fix 2: Fix missing quotes around special characters
    corrected = fixQuotes(corrected);

    // Fix 3: Fix trailing spaces
    corrected = corrected.replace(/\s+$/gm, "");

    // Fix 4: Fix missing colons after keys
    corrected = corrected.replace(/^(\s*)([^:\s]+)(\s*)$/gm, "$1$2:$3");

    // Fix 5: Handle empty values
    corrected = corrected.replace(/^(\s*[^:\s]+):\s*$/gm, "$1: \"\"");
    
    // Verify if our corrections worked
    try {
      yaml.load(corrected);
      return corrected;
    } catch (e) {
      // If still invalid, try a more aggressive approach
      corrected = tryAggressiveRepair(yamlContent);
      return corrected;
    }
  }
};

// Helper function to fix indentation
const fixIndentation = (content: string): string => {
  const lines = content.split("\n");
  const result: string[] = [];
  let lastIndent = 0;
  let inSequence = false;

  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) {
      result.push("");
      continue;
    }

    // Calculate indent level
    const match = line.match(/^(\s*)/);
    const indent = match ? match[1].length : 0;

    // Check if this is a sequence item
    const isSequenceItem = line.trim().startsWith("-");
    
    // Adjust indentation based on context
    if (isSequenceItem && !inSequence) {
      inSequence = true;
    } else if (!isSequenceItem && inSequence) {
      inSequence = false;
    }

    // If indentation seems off (jumping more than 2 spaces at once), fix it
    if (indent > lastIndent + 4) {
      const newIndent = " ".repeat(lastIndent + 2);
      result.push(newIndent + line.trim());
    } else {
      result.push(line);
    }

    // Update lastIndent for non-empty lines
    if (line.trim()) {
      lastIndent = indent;
    }
  }

  return result.join("\n");
};

// Helper function to fix quotes
const fixQuotes = (content: string): string => {
  // Find values that might need quotes
  const needQuotesRegex = /^(\s*)([^:\s]+):\s*([^#"\n][^#\n]*[:{}\[\],&*%@`"|<>=!]+[^#\n]*)$/gm;
  return content.replace(needQuotesRegex, '$1$2: "$3"');
};

// More aggressive repair attempt
const tryAggressiveRepair = (content: string): string => {
  try {
    // Try to parse each line as a key-value pair
    const lines = content.split("\n");
    const result: string[] = [];
    
    for (let line of lines) {
      line = line.trim();
      
      // Skip empty lines or comments
      if (!line || line.startsWith("#")) {
        result.push(line);
        continue;
      }
      
      // Try to extract key-value format
      const colonPos = line.indexOf(":");
      
      if (colonPos > 0) {
        const key = line.substring(0, colonPos).trim();
        let value = line.substring(colonPos + 1).trim();
        
        // If value has special characters, quote it
        if (value && /[:{}\[\],&*%@`"|<>=!]+/.test(value)) {
          value = `"${value}"`;
        }
        
        result.push(`${key}: ${value}`);
      } else if (line.trim().startsWith("-")) {
        // Handle list items
        result.push(line);
      } else {
        // If no colon found, assume it's a key with missing colon
        result.push(`${line.trim()}:`);
      }
    }
    
    return result.join("\n");
  } catch (e) {
    // If all else fails, return the original content
    console.error("Failed to repair YAML:", e);
    return content;
  }
};
