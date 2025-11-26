'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from './Input';
import clsx from 'clsx';

export interface ComboboxOption<T = any> {
  value: string | number;
  label: string;
  data?: T;
}

export interface ComboboxProps<T = any> {
  /**
   * Función para cargar todos los datos iniciales una sola vez
   * Los datos se guardan en un estado inmutable y se filtran localmente
   */
  loadInitialData: () => Promise<ComboboxOption<T>[]>;
  
  /**
   * Función de búsqueda personalizada (opcional, solo si no usas loadInitialData)
   * @deprecated Usa loadInitialData en su lugar para mejor rendimiento
   */
  searchFn?: (query: string) => Promise<ComboboxOption<T>[]>;
  
  /**
   * Valor seleccionado (el value de la opción)
   */
  value?: string | number;
  
  /**
   * Callback cuando se selecciona una opción
   */
  onChange?: (value: string | number, option?: ComboboxOption<T>) => void;
  
  /**
   * Placeholder del input
   */
  placeholder?: string;
  
  /**
   * Label del campo
   */
  label?: string;
  
  /**
   * Si el campo es requerido
   */
  required?: boolean;
  
  /**
   * Si el campo está deshabilitado
   */
  disabled?: boolean;
  
  /**
   * Clase CSS adicional
   */
  className?: string;
  
  /**
   * Función para obtener el texto a mostrar cuando hay un valor seleccionado
   * Si no se proporciona, se usa el label de la opción encontrada
   */
  getDisplayText?: (value: string | number) => string;
  
  /**
   * Función para filtrar las opciones localmente
   * Si no se proporciona, se usa un filtro por defecto que busca en el label
   */
  filterFn?: (option: ComboboxOption<T>, query: string) => boolean;
  
  /**
   * Número mínimo de caracteres para mostrar resultados filtrados
   */
  minSearchLength?: number;
}

export function Combobox<T = any>({
  loadInitialData,
  value,
  onChange,
  placeholder = 'Buscar...',
  label,
  required = false,
  disabled = false,
  className,
  getDisplayText,
  filterFn,
  minSearchLength = 0,
}: ComboboxProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allOptions, setAllOptions] = useState<readonly ComboboxOption<T>[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<ComboboxOption<T>[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<ComboboxOption<T> | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Función de filtrado por defecto
  const defaultFilterFn = useCallback((option: ComboboxOption<T>, query: string): boolean => {
    return option.label.toLowerCase().includes(query.toLowerCase());
  }, []);

  // Cargar datos iniciales una sola vez
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      setError(null);
      
      try {
        const data = await loadInitialData();
        setAllOptions(data);
        setFilteredOptions(data);
        
        // Si hay un valor inicial, buscar la opción correspondiente
        if (value !== undefined && value !== null && value !== '') {
          const initialOption = data.find(opt => String(opt.value) === String(value));
          if (initialOption) {
            setSelectedOption(initialOption);
            setDisplayText(initialOption.label);
          } else if (getDisplayText) {
            setDisplayText(getDisplayText(value));
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos';
        setError(errorMessage);
        console.error('Error loading initial data:', err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadData();
  }, [loadInitialData, value, getDisplayText]);

  // Filtrar opciones localmente cuando cambia el query
  useEffect(() => {
    if (searchQuery.length < minSearchLength) {
      setFilteredOptions([]);
      setIsOpen(false);
      return;
    }

    const filter = filterFn || defaultFilterFn;
    const filtered = allOptions.filter(option => filter(option, searchQuery));
    setFilteredOptions(filtered);
    
    if (filtered.length > 0 && searchQuery.length >= minSearchLength) {
      setIsOpen(true);
    } else if (searchQuery.length >= minSearchLength) {
      setIsOpen(true);
    }
  }, [searchQuery, allOptions, filterFn, defaultFilterFn, minSearchLength]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Restaurar el texto del valor seleccionado si existe
        if (selectedOption) {
          setSearchQuery(selectedOption.label);
        } else if (value && getDisplayText) {
          setSearchQuery(getDisplayText(value));
        } else {
          setSearchQuery('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedOption, value, getDisplayText]);

  // Manejar selección de opción
  const handleSelectOption = (option: ComboboxOption<T>) => {
    setSelectedOption(option);
    setDisplayText(option.label);
    setSearchQuery(option.label);
    setIsOpen(false);
    onChange?.(option.value, option);
  };

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    setSelectedOption(null);
    
    // Si se borra el texto, limpiar la selección
    if (newQuery === '') {
      onChange?.('', undefined);
    }
  };

  // Manejar focus en el input
  const handleInputFocus = () => {
    if (searchQuery.length >= minSearchLength || searchQuery.length === 0) {
      // Si no hay query, mostrar todas las opciones
      if (searchQuery.length === 0) {
        setFilteredOptions([...allOptions]);
      }
      setIsOpen(true);
    }
  };

  // Manejar teclas en el input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      if (selectedOption) {
        setSearchQuery(selectedOption.label);
      }
    } else if (e.key === 'Enter' && filteredOptions.length > 0 && isOpen) {
      e.preventDefault();
      handleSelectOption(filteredOptions[0]);
    }
  };

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          disabled={disabled || isInitialLoading}
          className="w-full"
        />
        
        {/* Indicador de carga inicial */}
        {isInitialLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        )}
      </div>

      {/* Dropdown de opciones */}
      {isOpen && !isInitialLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg dark:shadow-xl max-h-60 overflow-auto combobox-dropdown">
          {error ? (
            <div className="px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
              {error}
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery.length < minSearchLength
                ? `Escribe al menos ${minSearchLength} carácter${minSearchLength > 1 ? 'es' : ''} para buscar`
                : 'No se encontraron resultados'}
            </div>
          ) : (
            <ul className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={`${option.value}-${index}`}
                  onClick={() => handleSelectOption(option)}
                  className={clsx(
                    'px-4 py-2 cursor-pointer text-sm transition-colors',
                    'text-gray-900 dark:text-gray-100',
                    'hover:bg-blue-50 dark:hover:bg-gray-700',
                    'active:bg-blue-100 dark:active:bg-gray-600',
                    selectedOption?.value === option.value &&
                      'bg-blue-100 dark:bg-gray-700 font-medium'
                  )}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

