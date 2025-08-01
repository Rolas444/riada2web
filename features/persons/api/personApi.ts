import { Person } from "@/core/domain/person";
import { PersonRequest, PersonResponse } from "../types/personTypes";

export const CreatePerson = async (
  personData: PersonRequest,
  token: string
): Promise<PersonResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/person`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(personData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Ocurrió un error al crear el registro.");
  }

  return result;
};

export const updatePerson = async (
  personId: string,
  personData: Partial<PersonRequest>,
  token: string
): Promise<PersonResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";
  
  console.log('Updating person with ID:', personId, 'Data:', personData);

  const response = await fetch(`${apiUrl}/protected/person/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(personData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Ocurrió un error al actualizar el registro.");
  }

  return result;
};

export const getPersons = async (
  token: string,
  query?: string | null
): Promise<Person[]> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  let url = `${apiUrl}/protected/person/search`;
  if (query) {
    url += `?q=${encodeURIComponent(query)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Ocurrió un error al obtener las personas.");
  }

  return result as Person[];
};
