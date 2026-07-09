import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-500">{user?.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              First Name
            </label>
            <p className="text-gray-900">{user?.firstName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Last Name
            </label>
            <p className="text-gray-900">{user?.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Email
            </label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Role
            </label>
            <p className="text-gray-900">{user?.role}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t flex space-x-3">
          <button className="btn-primary">Edit Profile</button>
          <button className="btn-secondary">Change Password</button>
        </div>
      </div>
    </div>
  );
}
