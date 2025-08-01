import { Person } from "@/core/domain/person";
import { Edit } from "lucide-react";

interface TabPersonDataProps {
    person: Person | null;
    onEditClick: (person: Person) => void;
}

export const TabPersonData = ({ person, onEditClick }: TabPersonDataProps) => {
    if (!person) {
        return (
            <div className="p-4 text-center text-gray-500">
                <p>Seleccione una persona de la tabla para ver sus detalles.</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{`${person.name} ${person.middleName} ${person.lastName}`}</h3>
                <button 
                    onClick={() => onEditClick(person)}
                    className="p-1.5 text-gray-500 rounded-md hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-colors"
                    aria-label={`Editar a ${person.name}`}
                >
                    <Edit size={18} />
                </button>
            </div>
            <p><span className="font-semibold text-gray-600 dark:text-gray-400">Email:</span> {person.email || 'N/A'}</p>
            <p><span className="font-semibold text-gray-600 dark:text-gray-400">Documento:</span> {person.typeDoc && person.docNumber ? `${person.typeDoc}: ${person.docNumber}` : 'N/A'}</p>
            <p><span className="font-semibold text-gray-600 dark:text-gray-400">Nacimiento:</span> {person.birthday ? new Date(person.birthday).toLocaleDateString() : 'N/A'}</p>
            <p><span className="font-semibold text-gray-600 dark:text-gray-400">Sexo:</span> {person.sex === 'M' ? 'Masculino' : 'Femenino'}</p>
        </div>
    );
}