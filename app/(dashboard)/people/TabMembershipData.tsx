import { Person } from "@/core/domain/person";

interface TabMembershipDataProps {
    person: Person | null;
}

export const TabMembershipData = ({ person }: TabMembershipDataProps) => {
    if (!person) {
        return (
             <div className="p-4 text-center text-gray-500">
                <p>Seleccione una persona para ver su membresía.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold">Membresía de {person.name}</h3>
            <div className="mt-2 text-center text-gray-500">
                <p>La información de la membresía se mostrará aquí.</p>
            </div>
        </div>
    );
}