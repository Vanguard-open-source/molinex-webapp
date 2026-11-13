export class TechnicianReference {
  readonly #principalId: number;
  readonly #displayName: string;

  constructor(principalId: number, displayName: string) {
    if (!Number.isInteger(principalId) || principalId <= 0 || !displayName.trim()) {
      throw new Error('Technician identification and display name are required.');
    }
    this.#principalId = principalId;
    this.#displayName = displayName.trim();
  }

  get principalId(): number {
    return this.#principalId;
  }

  get displayName(): string {
    return this.#displayName;
  }
}
