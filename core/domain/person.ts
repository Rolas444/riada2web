import { Address } from "./address";
import { Membership } from "./membership";
import { Phone } from "./phone";

/**
 * Define el género de una persona.
 */
export type Sex = "M" | "F" ;

/**
 * Define el tipo de documento de identificación.
 */
export type DocType = "DNI" | "Passport" | "CE";

/**
 * Define el estado civil de una persona.
 */
export type CivilStatus = "SOL" | "CAS" | "DiV" | "VIU" | "SEP" | "CON" | "ULI";

/**
 * Representa la información personal de un individuo.
 */
export interface Person {
  id: string;
  name: string;
  middleName?: string;
  lastName: string;
  sex: Sex;
  email: string;
  birthday: string; // Se espera el formato "YYYY-MM-DD"
  docNumber?: string;
  typeDoc?: DocType;
  civilStatus?: CivilStatus;
  childrenCount?: number;
  photo?: string;
  addresses: Address[]; // Array de IDs de direcciones
  phones: Phone[]; // Array de IDs de teléfonos
  membership?: Membership; 
}