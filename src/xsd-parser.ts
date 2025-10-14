import { XMLParser } from 'fast-xml-parser';
import { XSDSchema, XSDComplexType, XSDSimpleType, XSDElement, XSDAttribute } from './types';

export class XSDParser {
  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true
    });
  }

  parseXSD(xsdContent: string): XSDSchema {
    const parsed = this.parser.parse(xsdContent);
    const schema = parsed['xs:schema'] || parsed.schema;
    
    if (!schema) {
      throw new Error('Invalid XSD: No schema element found');
    }

    return {
      targetNamespace: schema['@_targetNamespace'],
      elements: this.parseElements(schema['xs:element'] || []),
      complexTypes: this.parseComplexTypes(schema['xs:complexType'] || []),
      simpleTypes: this.parseSimpleTypes(schema['xs:simpleType'] || [])
    };
  }

  private parseElements(elements: any[]): XSDElement[] {
    if (!Array.isArray(elements)) {
      elements = elements ? [elements] : [];
    }

    return elements.map(element => ({
      name: element['@_name'],
      type: element['@_type'],
      minOccurs: element['@_minOccurs'],
      maxOccurs: element['@_maxOccurs'],
      attributes: this.parseAttributes(element['xs:attribute'] || []),
      children: this.parseElements(element['xs:element'] || [])
    }));
  }

  private parseAttributes(attributes: any[]): XSDAttribute[] {
    if (!Array.isArray(attributes)) {
      attributes = attributes ? [attributes] : [];
    }

    return attributes.map(attr => ({
      name: attr['@_name'],
      type: attr['@_type'],
      use: attr['@_use'],
      default: attr['@_default']
    }));
  }

  private parseComplexTypes(complexTypes: any[]): XSDComplexType[] {
    if (!Array.isArray(complexTypes)) {
      complexTypes = complexTypes ? [complexTypes] : [];
    }

    return complexTypes.map(ct => ({
      name: ct['@_name'],
      elements: this.parseElements(ct['xs:sequence']?.['xs:element'] || ct['xs:element'] || []),
      attributes: this.parseAttributes(ct['xs:attribute'] || [])
    }));
  }

  private parseSimpleTypes(simpleTypes: any[]): XSDSimpleType[] {
    if (!Array.isArray(simpleTypes)) {
      simpleTypes = simpleTypes ? [simpleTypes] : [];
    }

    return simpleTypes.map(st => {
      const restriction = st['xs:restriction'];
      const enumerations = restriction?.['xs:enumeration'];
      
      return {
        name: st['@_name'],
        base: restriction?.['@_base'] || 'string',
        restrictions: Array.isArray(enumerations) 
          ? enumerations.map(e => e['@_value'])
          : enumerations ? [enumerations['@_value']] : []
      };
    });
  }
}
