export type MinistryStatus = "A" | "I"; // Activo, Inactivo

export interface Ministry {
  id?: string;
  name: string;
  description?: string;
  mission?: string;
  status: MinistryStatus;
}

export interface MinistryMember {
  id?: string;
  ministryId: string;
  personId: string;
  role?: string;
  status: MinistryStatus;
}
