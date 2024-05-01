import { JSONSchemaType } from 'ajv';

export interface InputNumber {
  number: number;
}

export const inputNumberSchema: JSONSchemaType<InputNumber> = {
  type: 'object',
  properties: {
    number: {
      type: 'integer',
      minimum: 1,
      maximum: Number.MAX_SAFE_INTEGER,
    },
  },
  required: ['number'],
  additionalProperties: false,
};
