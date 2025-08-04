import React from 'react';
import { Person } from "@/core/domain/person";
import { CalculateAge } from "@/lib/utils";

// Importing the CalculateAge function from utils
const calculateAge = CalculateAge;

interface PeopleTableProps {
  persons: Person[];
  onRowClick: (person: Person) => void;
  selectedPersonId?: string | null;
}

const PeopleTable: React.FC<PeopleTableProps> = ({ persons: people, onRowClick, selectedPersonId }) => {
  const columnsCount = 6;

  

  return (
    <div className="overflow-auto max-h-[450px] rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-800">
        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700/80">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
              Nombre Completo
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
              Documento
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
              Correo Electrónico
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
              Fecha de Nacimiento
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
              Edad
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
              Sexo
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {people.length > 0 ? (
            people.map((person) => (
              <tr 
                key={person.id}
                onClick={() => onRowClick(person)}
                className={`cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50 ${
                  selectedPersonId === person.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">{`${person.name} ${person.middleName} ${person.lastName}`}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{person.typeDoc && person.docNumber ? `${person.typeDoc}: ${person.docNumber}` : 'N/A'}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{person.email ?? 'N/A'}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{person.birthday ? new Date(person.birthday).toLocaleDateString() : 'N/A'}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">
                  {calculateAge(person.birthday) ?? 'N/A'}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{person.sex === 'M' ? 'Masculino' : 'Femenino'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columnsCount} className="h-24 text-center text-gray-500 dark:text-gray-400">No se encontraron personas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PeopleTable;