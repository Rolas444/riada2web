"use client";

import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Person } from "@/core/domain/person";
import { useAuthStore } from "@/features/auth/store/authStore";
import { PersonResponse } from "@/features/persons/types/personTypes";
import React, { useState } from "react";
import { Toaster } from "sonner";
import { CreatePersonForm } from "./CreatePersonForm";

export default function PeoplePage() {
  const [isModalOpen, setModalOpen] = useState(false);

  const [Persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);

  const handlePersonCreated = () => {
    setModalOpen(false);
    // Refrescar la lista de usuarios después de una creación exitosa.
    // La notificación de éxito ya la maneja el formulario. 
    }

  return (
    <div>
      <Toaster richColors />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Personas
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Aquí puedes administrar las personas registradas en el sistema.
        </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Crear Persona</Button>
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Crear Nuevo Registo de Persona"
      >
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Completa los campos para registrar una Persona en el sistema.
        </p>
        <CreatePersonForm onFormSubmit={handlePersonCreated}></CreatePersonForm>
      </Modal>
    </div>
  );
}
