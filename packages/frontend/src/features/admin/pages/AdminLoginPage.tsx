import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/core/store';
import { useAdminLogin } from '@/core/api/mutations';
import { Button, Input } from '@/design-system/components';
import { useState } from 'react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const loginMutation = useAdminLogin();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      const result = await loginMutation.mutateAsync(data);
      login(result.token);

      // Redirect to the page they tried to visit or admin dashboard
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Invalid username or password';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-fg mb-2">Admin Login</h1>
            <p className="text-fg-secondary">Sign in to access the admin panel</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-fg mb-2">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register('username')}
                error={errors.username?.message}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-fg mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loginMutation.isPending}
              disabled={loginMutation.isPending}
            >
              Sign In
            </Button>
          </form>

          {/* Back to site link */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-accent hover:text-accent-hover transition-colors">
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
