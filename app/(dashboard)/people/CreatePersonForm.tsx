import ReusableForm from "@/components/ui/Form";
import { useAuthStore } from "@/features/auth/store/authStore";
import { PersonRequest } from "@/features/persons/types/personTypes";
import { toast } from "sonner";
import { CreatePerson, updatePerson } from "@/features/persons/api/personApi";
import { capitalizeWords } from "@/lib/textUtils";
import { PersonFormConfig } from "@/features/persons/config/personFormConfig";
import { Person } from "@/core/domain/person";
import { useEffect } from "react";

interface CreatePersonFormProps {
    onFormSubmit?: () => void;
    personToEdit?: Person | null;
}

export const CreatePersonForm: React.FC<CreatePersonFormProps> = ({ onFormSubmit, personToEdit }) => {
    const token = useAuthStore((state) => state.token);
    
  const handleSubmit = (data: PersonRequest) => {
    if (!token) {
      toast.error('No estás autenticado. Por favor, inicia sesión de nuevo.');
      return;
    }
    // console.log('Datos del formulario:', data);
    // Capitaliza y limpia los campos antes de enviar
    const payload = {
      ...data,
      name: capitalizeWords(data.name),
      middleName: capitalizeWords(data.middleName),
      lastName: capitalizeWords(data.lastName),
    };
    if (payload.docNumber === '') delete (payload as Partial<PersonRequest>).docNumber;
    if (payload.email === '') delete (payload as Partial<PersonRequest>).email;
    if (payload.birthday === '') delete (payload as Partial<PersonRequest>).birthday;
    // if (payload.typeDoc === '') delete (payload as Partial<PersonRequest>).typeDoc;

    if (personToEdit) {
      // Modo Edición
      toast.promise(updatePerson(personToEdit.id, payload, token), {
        loading: 'Actualizando persona...',
        success: (result) => {
          onFormSubmit?.();
          return result.message || 'Persona actualizada correctamente';
        },
        error: (error: any) => {
          return error.message || 'Ocurrió un error al actualizar.';
        },
      });
    } else {
      // Modo Creación
      toast.promise(CreatePerson(payload, token), {
        loading: 'Creando persona...',
        success: (result) => {
          onFormSubmit?.();
          return result.message || 'Persona creada correctamente';
        },
        error: (error: any) => {
          return error.message || 'Ocurrió un error inesperado.';
        },
      });
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
    />
  );

}