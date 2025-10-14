export interface XSDElement {
  name: string;
  type?: string;
  minOccurs?: string;
  maxOccurs?: string;
  attributes?: XSDAttribute[];
  children?: XSDElement[];
}

export interface XSDAttribute {
  name: string;
  type: string;
  use?: string;
  default?: string;
}

export interface XSDComplexType {
  name: string;
  elements: XSDElement[];
  attributes: XSDAttribute[];
}

export interface XSDSimpleType {
  name: string;
  base: string;
  restrictions?: string[];
}

export interface XSDSchema {
  targetNamespace?: string;
  elements: XSDElement[];
  complexTypes: XSDComplexType[];
  simpleTypes: XSDSimpleType[];
}

export interface TypeScriptInterface {
  name: string;
  properties: TypeScriptProperty[];
  isEnum?: boolean;
  enumValues?: string[];
}

export interface TypeScriptProperty {
  name: string;
  type: string;
  optional: boolean;
  array: boolean;
}
