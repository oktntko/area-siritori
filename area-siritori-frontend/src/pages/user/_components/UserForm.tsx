import { Icon } from '@iconify/react';
import { FormHTMLAttributes } from 'react';

interface UserFormProps extends FormHTMLAttributes<HTMLFormElement> {
  user: User;
}

export function UserForm(props: UserFormProps) {
  return (
    <form
      className="container flex max-w-80 flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit && props.onSubmit(e);
      }}
    >
      <section className="flex grow flex-col gap-2">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-900">
            Name
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={props.user.username}
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 ">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={props.user.email}
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
            required
          />
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="inline-flex items-center rounded-lg border border-red-700 bg-red-700 px-4 py-2.5 text-sm text-white hover:bg-red-800"
        >
          <Icon icon="mingcute:save-fill" className="-ml-2 mr-2 inline "></Icon>
          Submit
        </button>
        {props.children}
      </section>
    </form>
  );
}
