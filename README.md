# XSD to TypeScript Converter

A sample project that converts XSD (XML Schema Definition) files into TypeScript interface definitions. This project demonstrates how to parse XSD schemas and generate corresponding TypeScript types automatically.

## Features

- ✅ Parse XSD files and extract schema information
- ✅ Generate TypeScript interfaces from complex types
- ✅ Generate TypeScript enums from simple types with restrictions
- ✅ Handle nested types and relationships
- ✅ Support for optional properties and arrays
- ✅ Automatic type mapping (XSD types → TypeScript types)
- ✅ Batch processing of multiple XSD files

## Project Structure

```
xsd-to-ts-example/
├── src/                    # TypeScript source code
│   ├── index.ts           # Main entry point
│   ├── xsd-parser.ts      # XSD parsing logic
│   ├── ts-generator.ts    # TypeScript generation logic
│   └── types.ts           # Type definitions
├── xsd-files/             # Input XSD files
│   ├── user.xsd          # User schema example
│   ├── product.xsd       # Product schema example
│   └── order.xsd         # Order schema example
├── output/               # Generated TypeScript files
│   ├── user.ts          # Generated from user.xsd
│   ├── product.ts       # Generated from product.xsd
│   └── order.ts         # Generated from order.xsd
├── dist/                # Compiled JavaScript
└── package.json         # Project configuration
```

## Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

## Usage

### Build and Run

```bash
# Compile TypeScript and run the converter
npm run build

# Or run directly with ts-node (development)
npm run dev
```

### Manual Usage

```bash
# Clean output directory
npm run clean

# Build TypeScript
npm run build

# Run the converter
npm start
```

## How It Works

1. **XSD Parsing**: The `XSDParser` class uses `fast-xml-parser` to parse XSD files and extract:
   - Complex types with their elements and attributes
   - Simple types with restrictions (enums)
   - Element relationships and cardinality

2. **TypeScript Generation**: The `TypeScriptGenerator` class converts parsed XSD data into:
   - TypeScript interfaces for complex types
   - TypeScript enums for simple types with restrictions
   - Proper type mapping (XSD types → TypeScript types)
   - Optional properties and array types

3. **Batch Processing**: The main `index.ts` processes all XSD files in the `xsd-files` directory and outputs corresponding TypeScript files to the `output` directory.

## Example XSD Files

The project includes three example XSD files:

### User Schema (`user.xsd`)
- Defines user information with profile and address data
- Includes nested types and optional elements
- Demonstrates enum generation for address types

### Product Schema (`product.xsd`)
- Defines product catalog structure
- Shows complex nested relationships
- Includes inventory and specification data

### Order Schema (`order.xsd`)
- Defines order processing workflow
- Multiple enums for status, shipping, and payment methods
- Complex nested structures for items and totals

## Generated TypeScript Examples

### From User Schema:
```typescript
export interface UserType {
  id: number;
  username: string;
  email: string;
  profile: ProfileType;
  addresses: AddressListType;
  active?: boolean;
}

export enum AddressTypeEnum {
  HOME = 'home',
  WORK = 'work',
  BILLING = 'billing'
}
```

### From Product Schema:
```typescript
export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: PriceType;
  category: CategoryType;
  inventory: InventoryType;
  specifications: SpecificationListType;
  status?: ProductStatusEnum;
}
```

## Type Mapping

The converter automatically maps XSD types to TypeScript types:

| XSD Type | TypeScript Type |
|----------|----------------|
| `xs:string` | `string` |
| `xs:integer` | `number` |
| `xs:decimal` | `number` |
| `xs:boolean` | `boolean` |
| `xs:date` | `string` |
| `xs:dateTime` | `string` |
| Custom Types | Generated interfaces/enums |

## Adding Your Own XSD Files

1. Place your XSD files in the `xsd-files` directory
2. Run `npm run build` to process all XSD files
3. Generated TypeScript files will appear in the `output` directory

## Dependencies

- **fast-xml-parser**: XML parsing library
- **xml2js**: Alternative XML parsing (available but not used)
- **TypeScript**: TypeScript compiler
- **ts-node**: TypeScript execution for development

## Development

The project is structured for easy extension:

- `src/xsd-parser.ts`: Modify XSD parsing logic
- `src/ts-generator.ts`: Customize TypeScript generation
- `src/types.ts`: Add new type definitions
- `src/index.ts`: Change file processing logic

## License

MIT License - feel free to use this project as a starting point for your own XSD to TypeScript conversion needs.
