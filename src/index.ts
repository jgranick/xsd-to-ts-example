import * as fs from 'fs';
import * as path from 'path';
import { XSDParser } from './xsd-parser';
import { TypeScriptGenerator } from './ts-generator';

class XSDToTypeScriptConverter {
  private parser: XSDParser;
  private generator: TypeScriptGenerator;

  constructor() {
    this.parser = new XSDParser();
    this.generator = new TypeScriptGenerator();
  }

  async convertXSDToTypeScript(xsdFilePath: string, outputDir: string): Promise<void> {
    try {
      console.log(`Processing XSD file: ${xsdFilePath}`);
      
      // Read XSD file
      const xsdContent = fs.readFileSync(xsdFilePath, 'utf-8');
      
      // Parse XSD
      const schema = this.parser.parseXSD(xsdContent);
      
      // Generate TypeScript
      const tsContent = this.generator.generateTypeScript(schema);
      
      // Write output file
      const fileName = path.basename(xsdFilePath, '.xsd');
      const outputPath = path.join(outputDir, `${fileName}.ts`);
      
      fs.writeFileSync(outputPath, tsContent, 'utf-8');
      console.log(`Generated TypeScript file: ${outputPath}`);
      
    } catch (error) {
      console.error(`Error processing ${xsdFilePath}:`, error);
      throw error;
    }
  }

  async processAllXSDs(inputDir: string, outputDir: string): Promise<void> {
    console.log('Starting XSD to TypeScript conversion...');
    console.log(`Input directory: ${inputDir}`);
    console.log(`Output directory: ${outputDir}`);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Find all XSD files
    const files = fs.readdirSync(inputDir);
    const xsdFiles = files.filter(file => file.endsWith('.xsd'));
    
    if (xsdFiles.length === 0) {
      console.log('No XSD files found in input directory');
      return;
    }

    console.log(`Found ${xsdFiles.length} XSD file(s): ${xsdFiles.join(', ')}`);

    // Process each XSD file
    for (const xsdFile of xsdFiles) {
      const xsdPath = path.join(inputDir, xsdFile);
      await this.convertXSDToTypeScript(xsdPath, outputDir);
    }

    console.log('Conversion completed successfully!');
  }
}

// Main execution
async function main() {
  const converter = new XSDToTypeScriptConverter();
  
  const inputDir = path.join(__dirname, '..', 'xsd-files');
  const outputDir = path.join(__dirname, '..', 'output');
  
  try {
    await converter.processAllXSDs(inputDir, outputDir);
  } catch (error) {
    console.error('Conversion failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { XSDToTypeScriptConverter };
