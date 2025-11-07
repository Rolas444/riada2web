'use client';

import ReusableForm, { FieldConfig } from "@/components/ui/Form";
import { useAuthStore } from "@/features/auth/store/authStore";
import { toast } from "sonner";
import { addPhoneToPerson, updatePhoneToPerson } from "@/features/persons/api/personApi";
import { Phone } from "@/core/domain/phone";
import { useState } from "react";

interface AddPhoneFormProps {
    personId: string;
    onFormSubmit?: (phone: Phone) => void;
    phoneToEdit?: Phone | null;
}

const AddPhoneForm: React.FC<AddPhoneFormProps> = ({ personId, onFormSubmit, phoneToEdit }) => {
    const token = useAuthStore((state) => state.token);
    const isEditMode = !!phoneToEdit;
    const [isLoading, setIsLoading] = useState(false);

    const phoneFormConfig: FieldConfig<{ phone: string }>[] = [
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

    const handleSubmit = async (data: { phone: string }) => {
        if (!token) {
            toast.error('No estás autenticado.');
            return;
        }

        setIsLoading(true);
        try {
            if (isEditMode) {
                console.log('Editing phone:', phoneToEdit);
                const updatedPhone = { ...phoneToEdit, phone: data.phone };
                const result = await updatePhoneToPerson(token, updatedPhone);
                onFormSubmit?.(result.data);
                toast.success(result.message || 'Teléfono actualizado correctamente.');
            } else {
                const result = await addPhoneToPerson(token, personId, data.phone);
                onFormSubmit?.(result.data);
                toast.success(result.message || 'Teléfono agregado correctamente.');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al procesar la solicitud.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const defaultValues = isEditMode ? { phone: phoneToEdit.phone } : undefined;

    return (
        <ReusableForm
            fields={phoneFormConfig}
            onSubmit={handleSubmit}
            submitButtonText={isEditMode ? "Actualizar Teléfono" : "Agregar Teléfono"}
            defaultValues={defaultValues}
            isLoading={isLoading}
        />
    );
};

export default AddPhoneForm;