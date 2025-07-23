'use client';

import { User } from '@/features/users/types/userTypes';

interface UsersTableProps {
  users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
              ID
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
              Nombre de Usuario
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
              Rol
            </th>
            <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
              Fecha de Creación
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user,i) => (
            <tr key={i}>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">{user.id}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{user.username}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{user.role}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-200">{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;

