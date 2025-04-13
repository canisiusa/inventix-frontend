"use strict";
// This script generates a TypeScript interface from a JSON file.
// It reads the JSON file, checks its validity, and generates an interface based on its structure.
// The generated interface is saved to a specified output file.
// Usage: 1- npx tsc generate-interface.ts
// Ensure you have TypeScript installed globally or use npx to run the script.
// Run the script using Node.js
// 2- node generate-interface.js
// Ensure you have Node.js installed on your system.
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var inputFilePath = path.join(__dirname, 'fr.json');
var outputFilePath = path.join(__dirname, '../../types/translations.interface.ts');
console.log('inputFilePath', inputFilePath);
console.log('outputFilePath', outputFilePath);
if (!fs.existsSync(inputFilePath)) {
    console.error("Le fichier ".concat(inputFilePath, " n'existe pas."));
    process.exit(1);
}
// Vérification du format JSON
try {
    var fileContent = fs.readFileSync(inputFilePath, 'utf-8');
    JSON.parse(fileContent);
}
catch (error) {
    console.error("Erreur lors de la lecture du fichier JSON : ".concat(error));
    process.exit(1);
}
// Chargement du fichier JSON
var data = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));
function generateInterface(obj, name) {
    if (name === void 0) { name = 'Translations'; }
    var output = "interface ".concat(name, " {\n");
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            output += "  ".concat(key, ": string;\n");
        }
        else if (Array.isArray(value)) {
            output += "  ".concat(key, ": any[];\n"); // Peut être affiné si besoin
        }
        else if (typeof value === 'object' && value !== null) {
            var subInterface = generateInterface(value, capitalize(key));
            output += "  ".concat(key, ": ").concat(capitalize(key), ";\n");
            output = subInterface + '\n' + output;
        }
    }
    output += "}\n";
    return output;
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// Génération de l'interface
var header = "/* eslint-disable @typescript-eslint/no-explicit-any */\n/* eslint-disable @typescript-eslint/no-unused-vars */\n\n";
var result = header + generateInterface(data);
fs.writeFileSync(outputFilePath, result, 'utf-8');
console.log('✅ Interface générée avec succès dans :', outputFilePath);
