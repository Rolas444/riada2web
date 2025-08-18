
'use client';

import ReusableForm, { FieldConfig } from "@/components/ui/Form";

interface AddressFormValues {
  address: string;
}

const addressFields: FieldConfig<AddressFormValues>[] = [
  {
    name: "address",
    label: "Dirección",
    type: "text",
    placeholder: "Ej: Av. Siempre Viva 742",
    validation: { required: "La dirección es obligatoria" },
  },
];

interface AddressFormProps {
  defaultValues?: Partial<AddressFormValues>;
  onSubmit: (data: AddressFormValues) => void;
  submitButtonText?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  defaultValues,
  onSubmit,
  submitButtonText = "Guardar dirección",
}) => {
  return (
    <ReusableForm<AddressFormValues>
      fields={addressFields}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      submitButtonText={submitButtonText}
    />
  );
};

export default AddressForm;