import { FieldConfig } from "@/components/ui/Form";
import { PersonRequest } from "../types/personTypes";

   // Configuración de campos para el formulario de Persona, basado en PersonRequest
  export const PersonFormConfig: FieldConfig<PersonRequest>[] = [
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
      type: 'date'
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
      name: 'civilStatus',
      label: 'Estado Civil',
      type: 'select',
      options: [
        { value: '', label: 'Seleccione...' },
        { value: 'SOL', label: 'Soltero(a)' },
        { value: 'CAS', label: 'Casado(a)' },
        { value: 'DiV', label: 'Divorciado(a)' },
        { value: 'VIU', label: 'Viudo(a)' },
        { value: 'SEP', label: 'Separado(a)' },
        { value: 'CON', label: 'Conviviente' },
        { value: 'ULI', label: 'Unión Libre' },
      ],
    },
    {
      name: 'childrenCount',
      label: 'Número de Hijos',
      type: 'number',
      placeholder: '0',
      validation: {
        min: {
          value: 0,
          message: 'El número de hijos no puede ser negativo'
        }
      },
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