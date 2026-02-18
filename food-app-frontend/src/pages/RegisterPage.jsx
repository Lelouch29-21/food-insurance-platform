import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerSchema } from '../schemas/authSchemas';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      toast.success('Account created');
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <h1 className="text-2xl font-bold">Register</h1>
        <input {...register('name')} placeholder="Name" className="w-full rounded-lg border px-3 py-2" />
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
          Create Account
        </button>
      </form>
    </main>
  );
}
