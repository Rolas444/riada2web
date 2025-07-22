
import React from 'react';
import ReusableForm, { FieldConfig } from '@/components/ui/Form';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store/authStore';
import { createUser } from '@/features/users/api/usersApi';
import { NewUserPayload } from '@/features/users/types/userTypes';

interface CreateUserFormProps {
  onFormSubmit?: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onFormSubmit }) => {
  // Los hooks se llaman en el nivel superior del componente.
  const token = useAuthStore((state) => state.token);

  const userFormConfig: FieldConfig<NewUserPayload>[] = [
    {
      name: 'username',
      label: 'Nombre de usuario',
      type: 'text',
      placeholder: 'Ingresa el nombre de usuario',
      validation: { required: 'El nombre de usuario es obligatorio' },
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      placeholder: 'Ingresa una contraseña segura',
      validation: {
        required: 'La contraseña es obligatoria',
        minLength: {
          value: 8,
          message: 'La contraseña debe tener al menos 8 caracteres',
        },
      },
    },
  ];

  const handleCreateUser = (data: NewUserPayload) => {
    if (!token) {
      toast.error('No estás autenticado. Por favor, inicia sesión de nuevo.');
      return;
    }

    // Usamos toast.promise para manejar los estados de carga, éxito y error
    // de una forma más limpia y declarativa.
    toast.promise(createUser(data, token), {
      loading: 'Creando usuario...',
      success: (result) => {
        if (onFormSubmit) {
          onFormSubmit(); // Cierra el modal o realiza otra acción
        }
        return result.message || 'Usuario creado correctamente';
      },
      error: (error: Error) => {
        // El mensaje de error vendrá del 'throw' en la función de la API.
        return error.message || 'Ocurrió un error inesperado.';
      },
    });
  };

  return (
    <ReusableForm
      fields={userFormConfig}
      onSubmit={handleCreateUser}
      submitButtonText="Crear Usuario"
    />
  );
};

export default CreateUserForm;
