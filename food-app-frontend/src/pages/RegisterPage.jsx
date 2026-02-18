import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Get Started</p>
          <h1 className="text-3xl font-extrabold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-600">Join and connect your food choices with policy outcomes.</p>
        </div>

        <input {...register('name')} placeholder="Name" className="field" />
        <input {...register('email')} placeholder="Email" className="field" />
        <input {...register('password')} type="password" placeholder="Password" className="field" />

        <button disabled={formState.isSubmitting} className="cta-btn w-full">
          Create Account
        </button>

        <p className="text-sm text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-orange-700 underline-offset-2 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
