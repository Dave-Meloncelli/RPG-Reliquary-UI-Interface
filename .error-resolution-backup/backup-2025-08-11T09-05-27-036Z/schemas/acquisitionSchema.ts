import { ark } from './arktype';

// Schema for AcquiredBookData and related types based on types.ts
export const bookDimensionsSchema = ark({
    width_mm: 'number',
    height_mm: 'number',
    thickness_mm: 'number',
    weight_grams: 'number',
});

export const acquiredBookDataSchema = ark({
    title: 'string',
    authors: 'string[]',
    'isbn?': 'string',
    'publisher?': 'string',
    'blurb?': 'string',
    'dimensions?': bookDimensionsSchema,
}).json;

export type AcquiredBookData = typeof acquiredBookDataSchema.infer;
