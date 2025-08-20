import { Person } from "@/core/domain/person";
import {
  AddAddressResponse,
  AddPhoneResponse,
  PersonRequest,
  PersonResponse,
} from "../types/personTypes";
import { Phone } from "@/core/domain/phone";
import { Address } from "@/core/domain/address";

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
    throw new Error(result.error || "Ocurrió un error al crear el registro.");
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

  //usa la misma dirección que de creación y el mismo médodo
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
    throw new Error(
      result.message || "Ocurrió un error al actualizar el registro."
    );
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
    throw new Error(
      result.message || "Ocurrió un error al obtener las personas."
    );
  }

  return result as Person[];
};

export const addPhoneToPerson = async (
  token: string,
  personId: string,
  phoneNumber: string
): Promise<AddPhoneResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/phone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phone: phoneNumber, personId }),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Ocurrió un error al agregar el teléfono.");
  }

  return result as AddPhoneResponse;
};

export const updatePhoneToPerson = async (
  token: string,
  phone: Phone
): Promise<AddPhoneResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/phone`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(phone),
  });
  console.log("Updating phone:", phone);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al actualizar el teléfono."
    );
  }

  return result as AddPhoneResponse;
};

export const addAddressToPerson = async (
  token: string,
  personId: string,
  address: string
): Promise<AddAddressResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/phone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ address, personId }),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Ocurrió un error al agregar el teléfono.");
  }

  return result as AddAddressResponse;
};

export const updateAddressToPerson = async (
  token: string,
  address: Address
): Promise<AddAddressResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/phone`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Ocurrió un error al agregar el teléfono.");
  }

  return result as AddAddressResponse;
};
