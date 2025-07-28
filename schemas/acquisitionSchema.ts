import { ark } from './arktype';

export const bookDimensionsSchema = ark({
  width_mm: 'number',
  height_mm: 'number',
  thickness_mm: 'number',
  weight_grams: 'number',
});

export const acquiredBookDataSchema = ark({
  title: 'string',
  authors: ['string', '[]'],
  isbn: 'string?',
  publisher: 'string?',
  blurb: 'string?',
  dimensions: bookDimensionsSchema.optional,
}).json;

export type BookDimensions = typeof bookDimensionsSchema.infer;
export type AcquiredBookData = typeof acquiredBookDataSchema.infer;
