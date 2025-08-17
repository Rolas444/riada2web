'use client';

import ReusableForm, { FieldConfig } from "@/components/ui/Form";
import { useAuthStore } from "@/features/auth/store/authStore";
import { toast } from "sonner";
import { addPhoneToPerson } from "@/features/persons/api/personApi";
import { Phone } from "@/core/domain/phone";

interface AddPhoneFormProps {
    personId: string;
    onFormSubmit?: (newPhone: Phone) => void;
}

const AddPhoneForm: React.FC<AddPhoneFormProps> = ({ personId, onFormSubmit }) => {
    const token = useAuthStore((state) => state.token);

    const phoneFormConfig: FieldConfig<any>[] = [
        {
            name: 'phone',
            label: 'Número de Teléfono',
            type: 'text' as const,
            placeholder: 'Ingrese el número de teléfono',
            validation: {
                required: 'El número es obligatorio.',
                minLength: { value: 7, message: 'Debe tener al menos 7 dígitos.' },
                pattern: { value: /^[0-9+()-.\s]+$/, message: 'Número no válido.' }
            }
        }
    ];

    const handleSubmit = (data: { phone: string }) => {
        if (!token) {
            toast.error('No estás autenticado.');
            return;
        }

        toast.promise(addPhoneToPerson(token, personId, data.phone), {
            loading: 'Agregando teléfono...',
            success: (result) => {
                onFormSubmit?.(result.data); // Pasamos el objeto 'Phone' desde la propiedad 'data'
                return result.message || 'Teléfono agregado correctamente.';
            },
            error: (error: any) => {
                return error.message || 'Ocurrió un error al agregar el teléfono.';
            }
        });
    };

    return (
        <ReusableForm
            fields={phoneFormConfig}
            onSubmit={handleSubmit}
            submitButtonText="Agregar Teléfono"
        />
    );
};

export default AddPhoneForm;