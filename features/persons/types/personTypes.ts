import { DocType, Sex } from "@/core/domain/person";

export interface PersonResponse {
  message: string;
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
