import axios from 'axios';
import { useNavigate } from '~/router';
import { UserForm } from './_components/UserForm';

export default function Home() {
  const navigate = useNavigate();

  const [user] = useState<User>({
    user_id: 0,
    username: '',
    email: '',
    updated_at: '',
  });

  return (
    <UserForm
      user={user}
      onSubmit={async (e) => {
        const form = new FormData(e.currentTarget);
        const username = form.get('username') || '';
        const email = form.get('email') || '';

        try {
          await axios.post<User>(`/api/user`, { username, email });
          navigate('/user');
        } catch {
          //
        }
      }}
    ></UserForm>
  );
}
