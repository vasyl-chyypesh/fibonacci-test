import { JSONSchemaType } from 'ajv';

export interface TicketNumber {
  ticket: number;
}

export const ticketNumberSchema: JSONSchemaType<TicketNumber> = {
  type: 'object',
  properties: {
    ticket: {
      type: 'integer',
      minimum: 1,
      maximum: Number.MAX_SAFE_INTEGER,
    },
  },
  required: ['ticket'],
  additionalProperties: false,
};
