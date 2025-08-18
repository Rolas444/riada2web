'use client';

import ReusableForm, { FieldConfig } from "@/components/ui/Form";
import { useAuthStore } from "@/features/auth/store/authStore";
import { toast } from "sonner";
import { addPhoneToPerson, updatePhoneToPerson } from "@/features/persons/api/personApi";
import { Phone } from "@/core/domain/phone";

interface AddPhoneFormProps {
    personId: string;
    onFormSubmit?: (phone: Phone) => void;
    phoneToEdit?: Phone | null;
}

const AddPhoneForm: React.FC<AddPhoneFormProps> = ({ personId, onFormSubmit, phoneToEdit }) => {
    const token = useAuthStore((state) => state.token);
    const isEditMode = !!phoneToEdit;

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

        if (isEditMode) {
            console.log('Editing phone:', phoneToEdit);
            const updatedPhone = { ...phoneToEdit, phone: data.phone };
            toast.promise(updatePhoneToPerson(token, updatedPhone), {
                loading: 'Actualizando teléfono...',
                success: (result) => {
                    onFormSubmit?.(result.data);
                    return result.message || 'Teléfono actualizado correctamente.';
                },
                error: (error: any) => {
                    return error.message || 'Ocurrió un error al actualizar el teléfono.';
                }
            });
        } else {
            toast.promise(addPhoneToPerson(token, personId, data.phone), {
                loading: 'Agregando teléfono...',
                success: (result) => {
                    onFormSubmit?.(result.data);
                    return result.message || 'Teléfono agregado correctamente.';
                },
                error: (error: any) => {
                    return error.message || 'Ocurrió un error al agregar el teléfono.';
                }
            });
        }
    };

    const defaultValues = isEditMode ? { phone: phoneToEdit.phone } : undefined;

    return (
        <ReusableForm
            fields={phoneFormConfig}
            onSubmit={handleSubmit}
            submitButtonText={isEditMode ? "Actualizar Teléfono" : "Agregar Teléfono"}
            defaultValues={defaultValues}
        />
    );
};

export default AddPhoneForm;