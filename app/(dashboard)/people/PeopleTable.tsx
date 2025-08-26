import React from 'react';
import { useEffect, useMemo, useState } from 'react';
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

  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((people?.length ?? 0) / pageSize));
  }, [people]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [people, totalPages, currentPage]);

  const pagedPeople = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return people.slice(startIndex, startIndex + pageSize);
  }, [people, currentPage]);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="overflow-auto max-h-[450px] rounded-t-lg">
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
          {pagedPeople.length > 0 ? (
            pagedPeople.map((person) => (
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
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-300">
          {people.length > 0 ? (
            (() => {
              const start = (currentPage - 1) * pageSize + 1;
              const end = Math.min(currentPage * pageSize, people.length);
              return `Mostrando ${start}-${end} de ${people.length}`;
            })()
          ) : 'Sin resultados'}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-200"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="text-xs text-gray-600 dark:text-gray-300 px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-200"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeopleTable;