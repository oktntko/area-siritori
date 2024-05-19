import { Icon } from '@iconify/react';
import axios from 'axios';
import { Link } from '~/router';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  async function searchUser() {
    const res = await axios.get<User[]>('/api/user');
    return res.data;
  }

  useEffect(() => {
    searchUser().then(setUsers);
  }, []);

  return (
    <div>
      <div className="mb-2">
        <Link
          to={`/user/add`}
          type="button"
          className="inline-flex items-center rounded-lg border border-red-700 bg-red-700 px-4 py-2.5 text-sm text-white hover:bg-red-800 "
        >
          <Icon icon="carbon:add-filled" className="-ml-2 mr-2 inline "></Icon>
          <span className="">Add User</span>
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                User Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Update Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.user_id} className="border-b bg-white hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4  ">
                    <Link
                      to={`/user/:user_id`}
                      params={{ user_id: `${user.user_id}` }}
                      key={user.user_id}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      #{user.user_id}
                    </Link>
                  </th>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.updated_at}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
