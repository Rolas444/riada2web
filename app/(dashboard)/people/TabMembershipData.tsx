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
    onMembershipUpdate?: (membership: Membership) => void;
}

export const TabMembershipData = ({ person, onMembershipUpdate }: TabMembershipDataProps) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [membershipFormKey, setMembershipFormKey] = useState(0);
    const { loading, error } = useMembership();

    // Usar directamente el membership de la persona seleccionada
    const membership = person?.membership || null;

    const handleCreateSuccess = (newMembership: Membership) => {
        setIsCreateModalOpen(false);
        setMembershipFormKey(prevKey => prevKey + 1); // Reset form key
        toast.success('Membership creado exitosamente');
        if (onMembershipUpdate) {
            onMembershipUpdate(newMembership);
        }
    };

    const handleEditSuccess = (updatedMembership: Membership) => {
        setIsEditModalOpen(false);
        toast.success('Membership actualizado exitosamente');
        if (onMembershipUpdate) {
            onMembershipUpdate(updatedMembership);
        }
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
        setMembershipFormKey(prevKey => prevKey + 1); // Reset form key
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
                {!membership ? (
                    <Button
                        onClick={handleOpenCreateModal}
                    >
                        Crear Membership
                    </Button>
                ) : (
                    <Button
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Editar Membership
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
                    <p className="text-sm mt-2">Haga clic en &quot;Crear Membership&quot; para agregar una nueva.</p>
                </div>
            ) : (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                    <div className="flex flex-wrap gap-x-6 gap-y-4">
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                Estado
                            </label>
                            <p className="text-sm font-semibold">
                                {membership.state === 'A' ? 'Activo' :
                                    membership.state === 'I' ? 'Inactivo' :
                                        membership.state === 'O' ? 'Otro' : 'Suspendido'}
                            </p>
                        </div>

                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                Fecha de Alta
                            </label>
                            <p className="text-sm">
                                {membership.startedAt ? new Date(membership.startedAt).toLocaleDateString() : 'No especificada'}
                            </p>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                Bautizado
                            </label>
                            <p className="text-sm">
                                {membership.baptized ? 'Sí' : 'No'}
                            </p>
                        </div>
                        {membership.baptismDate && (
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Fecha de Bautismo
                                </label>
                                <p className="text-sm">
                                    {new Date(membership.baptismDate).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                        {membership.nameLastChurch && (
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Última Iglesia
                                </label>
                                <p className="text-sm">{membership.nameLastChurch}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            membership.membershipSigned
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                            {membership.membershipSigned ? 'firmó membresía' : 'no firmó membresía'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            membership.transferred
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                            {membership.transferred ? 'Transferido' : 'No Transferido'}
                        </span>
                    </div>
                </div>
            )}

            {/* Modal para crear membership */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title={`Crear Membership para ${person.name}`}
            >
                <CreateMembershipForm
                    key={membershipFormKey}
                    personId={person.id}
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </Modal>

            {/* Modal para editar membership */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={`Editar Membership de ${person.name}`}
            >
                <CreateMembershipForm
                    personId={person.id}
                    membershipToEdit={membership}
                    onSuccess={handleEditSuccess}
                    onCancel={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    );
}