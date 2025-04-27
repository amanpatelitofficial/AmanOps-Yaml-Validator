
import { useState } from "react";
import YamlEditor from "../components/YamlEditor";
import ValidationResult from "../components/ValidationResult";
import { validateYaml } from "../utils/yamlValidator";
import { Button } from "../components/ui/button";

const Index = () => {
  const [yaml, setYaml] = useState("# Enter your YAML here\nname: example\nversion: 1.0\n");
  const [validation, setValidation] = useState({
    isValid: true,
    errors: [],
    correctedYaml: "",
  });

  const handleValidate = () => {
    const result = validateYaml(yaml);
    setValidation(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">YAML Validator</h1>
          <p className="text-gray-600">Validate and correct your YAML syntax</p>
        </div>

        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter YAML
              </label>
              <YamlEditor value={yaml} onChange={setYaml} />
            </div>
            <Button
              onClick={handleValidate}
              className="w-full md:w-auto"
            >
              Validate YAML
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ValidationResult
              isValid={validation.isValid}
              errors={validation.errors}
              correctedYaml={validation.correctedYaml}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
