
'use client';

import ReusableForm, { FieldConfig } from "@/components/ui/Form";
import { useAuthStore } from "@/features/auth/store/authStore";
import { toast } from "sonner";
import { addAddressToPerson, updateAddressToPerson } from "@/features/persons/api/personApi";
import { Address } from "@/core/domain/address";
import { useState } from "react";

interface AddAddressFormProps {
    personId: string;
    onFormSubmit?: (address: Address) => void;
    addressToEdit?: Address | null;
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({ personId, onFormSubmit, addressToEdit }) => {
    const token = useAuthStore((state) => state.token);
    const isEditMode = !!addressToEdit;
    const [isLoading, setIsLoading] = useState(false);

    const addressFormConfig: FieldConfig<any>[] = [
        {
            name: 'address',
            label: 'Dirección',
            type: 'text' as const,
            placeholder: 'Ingrese la dirección completa',
            validation: {
                required: 'La dirección es obligatoria.',
                minLength: { value: 10, message: 'La dirección debe tener al menos 10 caracteres.' },
                maxLength: { value: 200, message: 'La dirección no puede exceder 200 caracteres.' }
            }
        }
    ];

    const handleSubmit = async (data: { address: string }) => {
        if (!token) {
            toast.error('No estás autenticado.');
            return;
        }

        setIsLoading(true);
        try {
            if (isEditMode) {
                console.log('Editing address:', addressToEdit);
                const updatedAddress = { ...addressToEdit, address: data.address };
                const result = await updateAddressToPerson(token, updatedAddress);
                onFormSubmit?.(result.data);
                toast.success(result.message || 'Dirección actualizada correctamente.');
            } else {
                const result = await addAddressToPerson(token, personId, data.address);
                onFormSubmit?.(result.data);
                toast.success(result.message || 'Dirección agregada correctamente.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Ocurrió un error al procesar la solicitud.');
        } finally {
            setIsLoading(false);
        }
    };

    const defaultValues = isEditMode ? { address: addressToEdit.address } : undefined;

    return (
        <ReusableForm
            fields={addressFormConfig}
            onSubmit={handleSubmit}
            submitButtonText={isEditMode ? "Actualizar Dirección" : "Agregar Dirección"}
            defaultValues={defaultValues}
            isLoading={isLoading}
        />
    );
};

export default AddAddressForm;