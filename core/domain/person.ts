/**
 * Define el género de una persona.
 */
export type Sex = "M" | "F" ;

/**
 * Define el tipo de documento de identificación.
 */
export type DocType = "DNI" | "Passport" | "CE";

/**
 * Representa la información personal de un individuo.
 */
export interface Person {
  name: string;
  middleName?: string;
  lastName: string;
  sex: Sex;
  email: string;
  birthday: string; // Se espera el formato "YYYY-MM-DD"
  docNumber?: string;
  typeDoc?: DocType;
  photo?: string;
}