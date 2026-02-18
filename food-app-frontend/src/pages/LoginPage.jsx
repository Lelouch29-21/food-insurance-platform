import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginSchema } from '../schemas/authSchemas';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Logged in');
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <input {...register('email')} placeholder="Email" className="w-full rounded-lg border px-3 py-2" />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full rounded-lg border px-3 py-2"
        />
        <button
          disabled={formState.isSubmitting}
          className="w-full rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white"
        >
          Sign In
        </button>
        <p className="text-sm text-gray-600">
          No account? <Link to="/register" className="text-brand-700">Create one</Link>
        </p>
      </form>
    </main>
  );
}
