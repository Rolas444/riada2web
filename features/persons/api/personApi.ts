import { PersonRequest, PersonResponse } from "../types/personTypes";

export const CreatePerson = async (
  personData: PersonRequest,
  token: string
): Promise<PersonResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/person`, {
    method: "POST",
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
