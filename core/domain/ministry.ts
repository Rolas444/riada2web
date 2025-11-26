export type MinistryStatus = "A" | "I"; // Activo, Inactivo

import { Person } from "./person";

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
  ministry?: Ministry;
  person?: Partial<Person> & {
    middlename?: string;
    lastname?: string;
  };
}
