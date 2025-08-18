import { Phone } from "@/core/domain/phone";
import { DocType, Sex } from "@/core/domain/person";
import { Address } from "@/core/domain/address";

export interface PersonResponse {
  message: string;
  data?: any; // Opcional para respuestas genéricas
}

export interface AddPhoneResponse extends PersonResponse {
  data: Phone;
}

export interface AddAddressResponse extends PersonResponse {
  data: Address;
}
export interface NewPersonPayload {
  person: PersonRequest;
}


export interface PersonRequest {
  id?: string; // Opcional para la creación, requerido para la edición
  name: string;
  middleName?: string;
  lastName: string;
  sex: Sex;
  birthday: string; // Se espera el formato "YYYY-MM-DD"
  docNumber?: string;
  typeDoc?: DocType;
  photo?: string;
  email: string;
}
