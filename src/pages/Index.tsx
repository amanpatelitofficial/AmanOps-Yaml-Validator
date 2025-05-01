
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import YamlEditor from "../components/YamlEditor";
import ValidationResult from "../components/ValidationResult";
import { validateYaml } from "../utils/yamlValidator";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "framer-motion";
import { Code, Bug, Zap } from "lucide-react";

const Index = () => {
  const [yaml, setYaml] = useState("# Enter your YAML here\nname: example\nversion: 1.0\n");
  const [validation, setValidation] = useState({
    isValid: true,
    errors: [],
    correctedYaml: "",
  });
  const { toast } = useToast();

  const handleValidate = () => {
    try {
      const result = validateYaml(yaml);
      setValidation(result);
      
      if (result.isValid) {
        toast({
          title: "Validation Successful",
          description: "Your YAML is valid!",
        });
      }
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "There was an error processing your YAML.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col items-center justify-start p-4"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-4xl text-center mb-8 mt-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          AmanOps
        </h1>
        <p className="text-xl text-gray-600 mt-2 flex items-center justify-center gap-2">
          Let's Code & Deploy <Code className="inline-block" />
        </p>
        <div className="flex items-center justify-center mt-2 text-green-600 font-medium">
          <Zap className="h-4 w-4 mr-1" />
          <span className="text-sm">Production Ready</span>
        </div>
      </motion.div>

      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-none">
          <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-t-lg py-6">
            <CardTitle className="text-3xl font-extrabold text-white drop-shadow-md">
              YAML Validator
            </CardTitle>
            <p className="text-white/80 mt-2 flex items-center justify-center gap-2">
              Validate your YAML syntax with ease <Bug className="h-4 w-4" />
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
                <div className="mt-4">
                  <Button 
                    onClick={handleValidate}
                    className="w-full px-4 py-2 text-base font-semibold 
                      bg-gradient-to-r from-purple-500 to-indigo-600 
                      hover:from-purple-600 hover:to-indigo-700 
                      transition-all duration-300 
                      shadow-md hover:shadow-lg"
                  >
                    Validate YAML
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validation Results
                </label>
                <ValidationResult
                  isValid={validation.isValid}
                  errors={validation.errors}
                  correctedYaml={validation.correctedYaml}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Index;
