import React, { useState } from 'react';
import { Person } from "@/core/domain/person";
import { Membership } from '@/core/domain/membership';
import { useMembership } from '@/features/membership';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { CreateMembershipForm } from '@/features/membership/components/CreateMembershipForm';
import { toast } from 'sonner';

interface TabMembershipDataProps {
    person: Person | null;
}

export const TabMembershipData = ({ person }: TabMembershipDataProps) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { createMembership, loading, error } = useMembership();

    // Usar directamente el membership de la persona seleccionada
    const membership = person?.membership || null;

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        // Recargar la página o actualizar el estado de la persona
        // Esto dependerá de cómo se maneje el estado en el componente padre
        toast.success('Membership creado exitosamente');
        // Opcional: recargar la página para mostrar el nuevo membership
        window.location.reload();
    };

    if (!person) {
        return (
             <div className="p-4 text-center text-gray-500">
                <p>Seleccione una persona para ver su membresía.</p>
            </div>
        );
    }

    return (
        <div className="p-4 dark:text-gray-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Membresía de {person.name}</h3>
                {!membership && (
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Crear Membership
                    </Button>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-800 dark:text-red-200">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-4">
                    <p>Creando membresía...</p>
                </div>
            ) : !membership ? (
                <div className="text-center py-8 text-gray-500">
                    <p>Esta persona no tiene una membresía registrada.</p>
                    <p className="text-sm mt-2">Haga clic en "Crear Membership" para agregar una nueva.</p>
                </div>
            ) : (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Estado
                            </label>
                            <p className="text-sm font-semibold">
                                {membership.state === 'A' ? 'Activo' : 
                                 membership.state === 'I' ? 'Inactivo' :
                                 membership.state === 'O' ? 'Otro' : 'Suspendido'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Status
                            </label>
                            <p className="text-sm">{membership.status}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Fecha de Inicio
                            </label>
                            <p className="text-sm">
                                {membership.startedAt ? new Date(membership.startedAt).toLocaleDateString() : 'No especificada'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Bautizado
                            </label>
                            <p className="text-sm">
                                {membership.Baptized ? 'Sí' : 'No'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            membership.membershipSigned 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                            {membership.membershipSigned ? 'Firmado' : 'No Firmado'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            membership.transferred
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                            {membership.transferred ? 'Transferido' : 'No Transferido'}
                        </span>
                    </div>

                    {membership.nameLastChurch && (
                        <div className="mt-3">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Última Iglesia
                            </label>
                            <p className="text-sm">{membership.nameLastChurch}</p>
                        </div>
                    )}

                    {membership.baptismDate && (
                        <div className="mt-3">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Fecha de Bautismo
                            </label>
                            <p className="text-sm">
                                {new Date(membership.baptismDate).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal para crear membership */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title={`Crear Membership para ${person.name}`}
            >
                <CreateMembershipForm
                    personId={person.id}
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </Modal>
        </div>
    );
}