import { Person, CivilStatus } from "@/core/domain/person";
import { CalculateAge } from "@/lib/utils";
import { Edit, MapPin, Phone, Plus } from "lucide-react";
import { Phone as PhoneType } from "@/core/domain/phone";

// Helper function to convert civil status code to readable text
const getCivilStatusText = (status: CivilStatus): string => {
  const statusMap: Record<CivilStatus, string> = {
    'SOL': 'Soltero(a)',
    'CAS': 'Casado(a)',
    'DiV': 'Divorciado(a)',
    'VIU': 'Viudo(a)',
    'SEP': 'Separado(a)',
    'CON': 'Conviviente',
    'ULI': 'Unión Libre'
  };
  return statusMap[status] || 'N/A';
};

interface TabPersonDataProps {
    person: Person | null;
    onEditClick: (person: Person) => void;
    onAddPhoneClick: () => void;
    onEditPhoneClick: (phone: PhoneType) => void;
    onAddAddressClick: () => void;
    onEditAddressClick: (address: any) => void;
}

export const TabPersonData = ({ person, onEditClick, onAddPhoneClick, onEditPhoneClick, onAddAddressClick, onEditAddressClick }: TabPersonDataProps) => {
    if (!person) {
        return (
            <div className="p-4 text-center text-gray-500">
                <p>Seleccione una persona de la tabla para ver sus detalles.</p>
            </div>
        );
    }

    return (
        <div className="flex divide-x divide-gray-200 dark:divide-gray-700">
            {/* Sección de Datos Personales */}
            <div className="w-1/2 p-4 space-y-2 dark:text-gray-300">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{`${person.name} ${person.middleName} ${person.lastName}`}</h3>
                    <button 
                        onClick={() => onEditClick(person)}
                        className="p-1.5 text-gray-500 rounded-md hover:cursor-pointer hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-colors"
                        aria-label={`Editar a ${person.name}`}
                    >
                        <Edit size={18} />
                    </button>
                </div>
                <p><span className="font-semibold text-gray-600 dark:text-gray-400">Email:</span> {person.email || 'N/A'}</p>
                <p><span className="font-semibold text-gray-600 dark:text-gray-400">Documento:</span> {person.typeDoc && person.docNumber ? `${person.typeDoc}: ${person.docNumber}` : 'N/A'}</p>
                <p><span className="font-semibold text-gray-600 dark:text-gray-400">Nacimiento:</span> {person.birthday ? new Date(person.birthday).toLocaleDateString() : 'N/A'}</p>
                <p><span className="font-semibold text-gray-600 dark:text-gray-400">Sexo:</span> {person.sex === 'M' ? 'Masculino' : 'Femenino'}</p>
                <p><span className="font-semibold text-gray-600 dark:text-gray-400">Estado Civil:</span> {person.civilStatus ? getCivilStatusText(person.civilStatus) : 'N/A'}</p>
                <p><span className="font-semibold text-gray-600 dark:text-gray-400">Número de Hijos:</span> {person.childrenCount ?? 0}</p>
                <p><span className="font-semibold text-gray-600 dark:text-gray-400">Edad:</span> {CalculateAge(person.birthday)}</p>
            </div>
            {/* Sección de Contacto */}
            <div className="w-1/2 p-4 space-y-4 dark:text-gray-300">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-semibold flex items-center">
                            <Phone size={16} className="mr-2" />
                            Teléfonos
                        </h4>
                        <button 
                            onClick={onAddPhoneClick}
                            className="p-1.5 text-gray-500 rounded-md hover:cursor-pointer hover:bg-gray-100 hover:text-green-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-green-400 transition-colors"
                            aria-label={`Añadir teléfono a ${person.name}`}
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    {person.phones && person.phones.length > 0 ? (
                        <ul className="space-y-1 text-sm">
                            {person.phones.map(phone => (
                                <li key={phone.id} className="flex justify-between items-center group">
                                    <span className="transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{phone.phone}</span>
                                    <button
                                        onClick={() => onEditPhoneClick(phone)}
                                        className="p-1 text-gray-400 hover:cursor-pointer rounded-md hover:bg-gray-200 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                                        aria-label={`Editar teléfono ${phone.phone}`}
                                    >
                                        <Edit size={14} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No hay teléfonos registrados.</p>
                    )}
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-semibold flex items-center">
                            <MapPin size={16} className="mr-2" />
                            Direcciones
                        </h4>
                        <button 
                            onClick={onAddAddressClick}
                            className="p-1.5 text-gray-500 rounded-md hover:cursor-pointer hover:bg-gray-100 hover:text-green-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-green-400 transition-colors"
                            aria-label={`Añadir dirección a ${person.name}`}
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    {person.addresses && person.addresses.length > 0 ? (
                        <ul className="space-y-1 text-sm">
                            {person.addresses.map(address => (
                                <li key={address.id} className="flex justify-between items-center group">
                                    <span className="transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{address.address}</span>
                                    <button
                                        onClick={() => onEditAddressClick(address)}
                                        className="p-1 text-gray-400 hover:cursor-pointer rounded-md hover:bg-gray-200 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                                        aria-label={`Editar dirección ${address.address}`}
                                    >
                                        <Edit size={14} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No hay direcciones registradas.</p>
                    )}
                </div>
            </div>
        </div>
    );
}