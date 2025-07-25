import { useAuthStore } from '@/store';
import React from 'react';

interface UserInfoProps {
    className?: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({ className = '' }) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
            <div className="flex items-center space-x-3">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.username.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {user.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                        {user.email}
                    </p>
                </div>

                {/* Role badge */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                    {user.role}
                </span>
            </div>
        </div>
    );
};

export default UserInfo;
