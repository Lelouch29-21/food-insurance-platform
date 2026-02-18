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
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Account Access</p>
          <h1 className="text-3xl font-extrabold text-slate-900">Login</h1>
          <p className="text-sm text-slate-600">Continue to order and track your insurance adjustment.</p>
        </div>

        <input {...register('email')} placeholder="Email" className="field" />
        <input {...register('password')} type="password" placeholder="Password" className="field" />

        <button disabled={formState.isSubmitting} className="cta-btn w-full">
          Sign In
        </button>

        <p className="text-sm text-slate-600">
          No account?{' '}
          <Link to="/register" className="font-semibold text-orange-700 underline-offset-2 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </main>
  );
}
