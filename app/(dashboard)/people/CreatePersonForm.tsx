import ReusableForm from "@/components/ui/Form";
import { useAuthStore } from "@/features/auth/store/authStore";
import { PersonRequest } from "@/features/persons/types/personTypes";
import { toast } from "sonner";
import { CreatePerson, updatePerson } from "@/features/persons/api/personApi";
import { capitalizeWords } from "@/lib/textUtils";
import { PersonFormConfig } from "@/features/persons/config/personFormConfig";
import { Person } from "@/core/domain/person";
import { useEffect, useState } from "react";

interface CreatePersonFormProps {
    onFormSubmit?: () => void;
    personToEdit?: Person | null;
}

export const CreatePersonForm: React.FC<CreatePersonFormProps> = ({ onFormSubmit, personToEdit }) => {
    const token = useAuthStore((state) => state.token);
    const [isLoading, setIsLoading] = useState(false);
    
  const handleSubmit = async (data: PersonRequest) => {
    if (!token) {
      toast.error('No estás autenticado. Por favor, inicia sesión de nuevo.');
      return;
    }

    setIsLoading(true);
    try {
      // Capitaliza y limpia los campos antes de enviar
      const payload = {
        ...data,
        name: capitalizeWords(data.name),
        middleName: capitalizeWords(data.middleName),
        lastName: capitalizeWords(data.lastName),
        childrenCount: data.childrenCount ? Number(data.childrenCount) : undefined,
      };
      if (payload.docNumber === '') delete (payload as Partial<PersonRequest>).docNumber;
      if (payload.email === '') delete (payload as Partial<PersonRequest>).email;
      if (payload.birthday === '') delete (payload as Partial<PersonRequest>).birthday;
      if (!payload.civilStatus) delete (payload as Partial<PersonRequest>).civilStatus;
      if (payload.childrenCount === undefined || payload.childrenCount === null) delete (payload as Partial<PersonRequest>).childrenCount;
      
      // Debug: Log the payload being sent
      console.log('Payload being sent to backend:', payload);

      if (personToEdit) {
        // Modo Edición
        const result = await updatePerson(personToEdit.id, payload, token);
        onFormSubmit?.();
        toast.success(result.message || 'Persona actualizada correctamente');
      } else {
        // Modo Creación
        const result = await CreatePerson(payload, token);
        onFormSubmit?.();
        toast.success(result.message || 'Persona creada correctamente');
      }
    } catch (error: any) {
      toast.error(error.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  const defaultValues = personToEdit ? {
    id: personToEdit.id,
    name: personToEdit.name,
    middleName: personToEdit.middleName,
    lastName: personToEdit.lastName,
    sex: personToEdit.sex,
    birthday: personToEdit.birthday ? new Date(personToEdit.birthday).toISOString().split('T')[0] : '',
    typeDoc: personToEdit.typeDoc ?? undefined,
    docNumber: personToEdit.docNumber || '',
    civilStatus: personToEdit.civilStatus ?? undefined,
    childrenCount: personToEdit.childrenCount ?? 0,
    email: personToEdit.email || '',
  } : undefined;

  // useEffect(()=>{
  // }, [personToEdit]);

  return (
    <ReusableForm
      fields={PersonFormConfig}
      onSubmit={handleSubmit}
      submitButtonText={personToEdit ? "Actualizar" : "Guardar"}
      defaultValues={defaultValues}
      isLoading={isLoading}
    />
  );

}