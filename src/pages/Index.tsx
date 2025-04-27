
import { useState } from "react";
import YamlEditor from "../components/YamlEditor";
import ValidationResult from "../components/ValidationResult";
import { validateYaml } from "../utils/yamlValidator";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-none">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg py-6">
            <CardTitle className="text-4xl font-extrabold text-white drop-shadow-md">
              YAML Validator
            </CardTitle>
            <p className="text-white/80 mt-2">
              Validate and correct your YAML syntax with ease
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6 p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter YAML
                </label>
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <YamlEditor 
                    value={yaml} 
                    onChange={setYaml} 
                  />
                </div>
              </div>
              
              <ValidationResult
                isValid={validation.isValid}
                errors={validation.errors}
                correctedYaml={validation.correctedYaml}
              />
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleValidate}
                className="px-8 py-3 text-base font-semibold 
                  bg-gradient-to-r from-blue-500 to-purple-600 
                  hover:from-blue-600 hover:to-purple-700 
                  transition-all duration-300 
                  shadow-md hover:shadow-lg"
              >
                Validate YAML
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Index;
