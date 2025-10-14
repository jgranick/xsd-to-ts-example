import { XSDSchema, XSDComplexType, XSDSimpleType } from './types';
import { TypeScriptInterface, TypeScriptProperty } from './types';

export class TypeScriptGenerator {
  private namespace: string = '';

  generateTypeScript(schema: XSDSchema): string {
    this.namespace = schema.targetNamespace || '';
    
    const interfaces: TypeScriptInterface[] = [];
    
    // Generate interfaces for complex types
    schema.complexTypes.forEach(ct => {
      interfaces.push(this.generateInterfaceFromComplexType(ct));
    });

    // Generate enums for simple types with restrictions
    schema.simpleTypes.forEach(st => {
      if (st.restrictions && st.restrictions.length > 0) {
        interfaces.push({
          name: this.getTypeName(st.name),
          isEnum: true,
          enumValues: st.restrictions,
          properties: []
        });
      }
    });

    // Generate interfaces for root elements
    schema.elements.forEach(element => {
      if (element.type) {
        const typeName = this.getTypeName(element.type);
        if (!interfaces.find(i => i.name === typeName)) {
          interfaces.push({
            name: typeName,
            properties: [],
            isEnum: false
          });
        }
      }
    });

    return this.generateTypeScriptContent(interfaces);
  }

  private generateInterfaceFromComplexType(complexType: XSDComplexType): TypeScriptInterface {
    const properties: TypeScriptProperty[] = [];

    // Add properties from elements
    complexType.elements.forEach(element => {
      properties.push({
        name: element.name,
        type: this.mapXSDTypeToTypeScript(element.type || 'string'),
        optional: element.minOccurs === '0',
        array: element.maxOccurs === 'unbounded' || (element.maxOccurs ? parseInt(element.maxOccurs) > 1 : false)
      });
    });

    // Add properties from attributes
    complexType.attributes.forEach(attr => {
      properties.push({
        name: attr.name,
        type: this.mapXSDTypeToTypeScript(attr.type),
        optional: attr.use !== 'required',
        array: false
      });
    });

    return {
      name: this.getTypeName(complexType.name),
      properties,
      isEnum: false
    };
  }

  private mapXSDTypeToTypeScript(xsdType: string): string {
    if (!xsdType) return 'string';

    // Handle namespace prefixes
    const typeName = xsdType.includes(':') ? xsdType.split(':')[1] : xsdType;
    
    // Map XSD types to TypeScript types
    const typeMap: { [key: string]: string } = {
      'string': 'string',
      'integer': 'number',
      'int': 'number',
      'long': 'number',
      'decimal': 'number',
      'float': 'number',
      'double': 'number',
      'boolean': 'boolean',
      'date': 'string',
      'dateTime': 'string',
      'time': 'string',
      'anyURI': 'string',
      'base64Binary': 'string',
      'hexBinary': 'string',
      'QName': 'string',
      'NOTATION': 'string'
    };

    return typeMap[typeName] || this.getTypeName(typeName);
  }

  private getTypeName(name: string): string {
    // Remove namespace prefix if present
    const cleanName = name.includes(':') ? name.split(':')[1] : name;
    
    // Convert to PascalCase
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }

  private generateTypeScriptContent(interfaces: TypeScriptInterface[]): string {
    let content = '// Generated TypeScript definitions from XSD\n';
    content += '// Generated on: ' + new Date().toISOString() + '\n\n';

    if (this.namespace) {
      content += `// Target namespace: ${this.namespace}\n\n`;
    }

    interfaces.forEach(interface_ => {
      if (interface_.isEnum) {
        content += this.generateEnum(interface_);
      } else {
        content += this.generateInterface(interface_);
      }
      content += '\n';
    });

    return content;
  }

  private generateInterface(interface_: TypeScriptInterface): string {
    let content = `export interface ${interface_.name} {\n`;
    
    interface_.properties.forEach(prop => {
      const optional = prop.optional ? '?' : '';
      const array = prop.array ? '[]' : '';
      content += `  ${prop.name}${optional}: ${prop.type}${array};\n`;
    });
    
    content += '}';
    return content;
  }

  private generateEnum(interface_: TypeScriptInterface): string {
    let content = `export enum ${interface_.name} {\n`;
    
    interface_.enumValues?.forEach((value, index) => {
      const enumKey = value.toUpperCase().replace(/[^A-Z0-9]/g, '_');
      content += `  ${enumKey} = '${value}'`;
      if (index < (interface_.enumValues?.length || 0) - 1) {
        content += ',';
      }
      content += '\n';
    });
    
    content += '}';
    return content;
  }
}
