'use client';

import React from 'react';
import { useForm, Controller, SubmitHandler, FieldValues, RegisterOptions, Path, DefaultValues, PathValue } from 'react-hook-form';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';

// Define la estructura para un único campo de formulario
export interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'date';
  placeholder?: string;
  validation?: RegisterOptions<T, Path<T>>;
  defaultValue?: PathValue<T, Path<T>>;
  disabled?: boolean;
  options?: { value: string; label: string }[];
}

interface ReusableFormProps<T extends FieldValues> {
  fields: FieldConfig<T>[];
  onSubmit: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>;
  submitButtonText?: string;
}

const ReusableForm = <T extends FieldValues>({
  fields,
  onSubmit,
  defaultValues,
  submitButtonText = 'Guardar Cambios',
}: ReusableFormProps<T>) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {field.label}
          </label>
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            defaultValue={field.defaultValue ?? ('' as PathValue<T, Path<T>>)}
            render={({ field: controllerField }) => {
              if (field.type === 'select') {
                return (
                  <Select
                    id={field.name}
                    {...controllerField}
                    className="mt-1"
                    disabled={field.disabled}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                );
              }
              return (
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  {...controllerField}
                  className="mt-1"
                  disabled={field.disabled}
                />
              );
            }}
          />
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}
      <Button type='submit'>
        {submitButtonText}
      </Button>
    </form>
  );
};

export default ReusableForm;
