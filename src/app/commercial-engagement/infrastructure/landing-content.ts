import { Plan } from '../domain/model/plan';
import { ValueProposition } from '../domain/model/value-proposition';
// Published landing-page read models: no plan endpoint or unpublished price is synthesized.
const basic = ['dashboard', 'production', 'quality'];
const professional = [...basic, 'traceability', 'maintenance', 'alerts'];
export const PUBLISHED_PLANS: readonly Plan[] = [
  { key: 'basic', requiresQuote: true, features: basic },
  { key: 'professional', requiresQuote: true, features: professional },
  {
    key: 'enterprise',
    requiresQuote: true,
    features: [...professional, 'reports', 'trends', 'support'],
  },
];
export const PUBLISHED_VALUE: ValueProposition = {
  titleKey: 'commercial.value-headline',
  descriptionKey: 'commercial.value-description',
  benefitKeys: ['losses', 'uptime', 'shared'],
};
