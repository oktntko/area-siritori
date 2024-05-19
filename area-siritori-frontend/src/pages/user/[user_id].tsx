import { Icon } from '@iconify/react';
import axios from 'axios';
import { useNavigate, useParams } from '~/router';
import { UserForm } from './_components/UserForm';

export default function Home() {
  const { user_id } = useParams('/user/:user_id');
  const navigate = useNavigate();

  const [user, setUser] = useState<User>();

  async function getUser() {
    const res = await axios.get<User>(`/api/user/${user_id}`);
    return res.data;
  }

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  if (!user) {
    return (
      <div className="container flex max-w-80 justify-center">
        <span className="animate-pulse rounded-full bg-blue-200 px-4 py-2 text-center text-xs font-medium uppercase leading-none">
          loading...
        </span>
      </div>
    );
  }

  return (
    <UserForm
      user={user}
      onSubmit={async (e) => {
        const form = new FormData(e.currentTarget);
        const username = form.get('username') || '';
        const email = form.get('email') || '';

        try {
          await axios.put<User>(`/api/user/${user_id}`, { username, email });
          navigate('/user');
        } catch {
          //
        }
      }}
    >
      <button
        type="button"
        className="inline-flex items-center rounded-lg border border-red-700 bg-red-700 px-4 py-2.5 text-sm text-white hover:bg-red-800"
        onClick={async () => {
          try {
            await axios.delete<User>(`/api/user/${user_id}`);
            navigate('/user');
          } catch {
            //
          }
        }}
      >
        <Icon icon="bi:trash" className="-ml-2 mr-2 inline "></Icon>
        Delete
      </button>
    </UserForm>
  );
}
