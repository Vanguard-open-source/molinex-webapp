export interface Plan {
  readonly key: 'basic' | 'professional' | 'enterprise';
  readonly features: readonly string[];
  readonly requiresQuote: true;
}
