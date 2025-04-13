// This script generates a TypeScript interface from a JSON file.
// It reads the JSON file, checks its validity, and generates an interface based on its structure.
// The generated interface is saved to a specified output file.
// Usage: 1- npx tsc generate-interface.ts
// Ensure you have TypeScript installed globally or use npx to run the script.
// Run the script using Node.js
// 2- node generate-interface.js
// Ensure you have Node.js installed on your system.

import * as fs from 'fs';
import * as path from 'path';


type JSONValue = string | number | boolean | JSONObject | JSONArray;
interface JSONObject { [x: string]: JSONValue; }
type JSONArray = Array<JSONValue>;

const inputFilePath = path.join(__dirname, 'fr.json');
const outputFilePath = path.join(__dirname, '../../types/translations.interface.ts');
console.log('inputFilePath', inputFilePath);
console.log('outputFilePath', outputFilePath);
if (!fs.existsSync(inputFilePath)) {
  console.error(`Le fichier ${inputFilePath} n'existe pas.`);
  process.exit(1);
}

// Vérification du format JSON
try {
  const fileContent = fs.readFileSync(inputFilePath, 'utf-8');
  JSON.parse(fileContent);
}
catch (error) {
  console.error(`Erreur lors de la lecture du fichier JSON : ${error}`);
  process.exit(1);
}
// Chargement du fichier JSON
const data = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));

function generateInterface(obj: JSONObject, name = 'Translations'): string {
  let output = `interface ${name} {\n`;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      output += `  ${key}: string;\n`;
    } else if (Array.isArray(value)) {
      output += `  ${key}: any[];\n`; // Peut être affiné si besoin
    } else if (typeof value === 'object' && value !== null) {
      const subInterface = generateInterface(value as JSONObject, capitalize(key));
      output += `  ${key}: ${capitalize(key)};\n`;
      output = subInterface + '\n' + output;
    }
  }

  output += `}\n`;
  return output;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Génération de l'interface
const header = `/* eslint-disable @typescript-eslint/no-explicit-any */\n/* eslint-disable @typescript-eslint/no-unused-vars */\n\n`;
const result = header + generateInterface(data);

fs.writeFileSync(outputFilePath, result, 'utf-8');
console.log('✅ Interface générée avec succès dans :', outputFilePath);
