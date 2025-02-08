'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TextField, IconButton, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '@/lib/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        username: formData.email,
        password: formData.password
      });

      if (response.data) {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
          redirect: false,
        });

        if (result?.error) {
          setError('Geçersiz email veya şifre');
        } else {
          router.replace('/collections');
        }
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full p-8">
        <div className="flex justify-center mb-8">
          <div className="text-2xl font-bold font-poppins">LOGO</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <TextField
              fullWidth
              variant="outlined"
              label="E-Posta"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johnsondoe@mcmail.com"
              className="font-poppins"
              InputProps={{
                className: 'font-poppins'
              }}
              InputLabelProps={{
                className: 'font-poppins'
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Şifre"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="font-poppins"
              InputProps={{
                className: 'font-poppins',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                className: 'font-poppins'
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="remember"
                  color="primary"
                  className="text-blue-600"
                />
              }
              label="Beni Hatırla"
              className="font-poppins"
            />
            {error && (
              <div className="text-red-500 text-sm font-poppins">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 font-poppins"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 