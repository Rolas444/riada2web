'use client';

import ReusableForm, { FieldConfig } from "@/components/ui/Form";
import { useAuthStore } from "@/features/auth/store/authStore";
import { toast } from "sonner";
// import { addPhoneToPerson } from "@/features/persons/api/personApi";

interface AddPhoneFormProps {
    personId: string;
    onFormSubmit?: () => void;
}

const AddPhoneForm: React.FC<AddPhoneFormProps> = ({ personId, onFormSubmit }) => {
    const token = useAuthStore((state) => state.token);

    const phoneFormConfig: FieldConfig<any>[] = [
        {
            name: 'number',
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

    const handleSubmit = (data: { number: string }) => {
        if (!token) {
            toast.error('No estás autenticado.');
            return;
        }
        console.log("Simulando envío de datos:", { number: data.number, personId });
        toast.success("Teléfono agregado (simulación).");
        onFormSubmit?.();
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