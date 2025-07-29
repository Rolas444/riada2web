import ReusableForm, { FieldConfig } from "@/components/ui/Form";
import { useAuthStore } from "@/features/auth/store/authStore";
import { NewPersonPayload, PersonRequest } from "@/features/persons/types/personTypes";
import { toast } from "sonner";
import { CreatePerson } from "@/features/persons/api/personApi";

interface CreatePersonFormProps {
    onFormSubmit?: () => void;
}

export const CreatePersonForm: React.FC<CreatePersonFormProps> = ({ onFormSubmit }) => {
    const token = useAuthStore((state) => state.token);

    // Configuración de campos para el formulario de Persona, basado en PersonRequest
  const personFormConfig: FieldConfig<PersonRequest>[] = [
    {
      name: 'name',
      label: 'Nombres',
      type: 'text',
      placeholder: 'Ingrese los nombres',
      validation: { required: 'El nombre es obligatorio' },
    },
    {
      name: 'middleName',
      label: 'Apellido Paterno',
      type: 'text',
      placeholder: 'Ingrese el apellido paterno',
      // Aunque es opcional en el tipo, a menudo es un requisito de negocio
      validation: { required: 'El apellido paterno es obligatorio' },
    },
    {
      name: 'lastName',
      label: 'Apellido Materno',
      type: 'text',
      placeholder: 'Ingrese el apellido materno',
      validation: { required: 'El apellido materno es obligatorio' },
    },
    {
      name: 'sex',
      label: 'Sexo',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione...' },
        { value: 'M', label: 'Masculino' },
        { value: 'F', label: 'Femenino' },
      ],
      validation: { required: 'Debe seleccionar un sexo' },
    },
    {
      name: 'birthday',
      label: 'Fecha de Nacimiento',
      type: 'date',
      // El navegador se encarga del formato, solo necesitamos la validación de requerido.
      validation: { required: 'La fecha de nacimiento es obligatoria' },
    },
    {
      name: 'typeDoc',
      label: 'Tipo de Documento',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione...' },
        { value: 'DNI', label: 'DNI' },
        { value: 'Passport', label: 'Pasaporte' },
        { value: 'CE', label: 'Carnet de Extranjería' },
      ],
    },
    {
      name: 'docNumber',
      label: 'Número de Documento',
      type: 'text',
      placeholder: 'XXXX-XXXX-XXXX',
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      placeholder: 'ejemplo@correo.com',
      validation: {
        // Opcional, pero si se ingresa, debe ser un email válido.
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Dirección de correo electrónico no válida',
        },
      },
    },
  ];

    
  const handleCreatePerson = (data: PersonRequest) => {
    if (!token) {
      toast.error('No estás autenticado. Por favor, inicia sesión de nuevo.');
      return;
    }

    // Limpia los campos opcionales si están vacíos para no enviarlos
    const payload = { ...data };
    if (payload.docNumber === '') delete (payload as Partial<PersonRequest>).docNumber;
    if (payload.email === '') delete (payload as Partial<PersonRequest>).email;
    // if (payload.typeDoc === '') delete (payload as Partial<PersonRequest>).typeDoc;

    toast.promise(CreatePerson(payload, token), {
      loading: 'Creando persona...',
      success: (result) => {
        if (onFormSubmit) {
          onFormSubmit();
        }
        return result.message || 'Persona creada correctamente';
      },
      error: (error: any) => {
        return error.message || 'Ocurrió un error inesperado.';
      },
    });
  };

return (
    <ReusableForm
      fields={personFormConfig}
      onSubmit={handleCreatePerson}
      submitButtonText="Crear Persona"
    />
  );


}