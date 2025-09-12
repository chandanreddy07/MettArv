import AuthForm from '../AuthForm';
import { useState } from 'react';

export default function AuthFormExample() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (data: { email: string; password: string; name?: string }) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (mode === 'register') {
        setSuccess('Account created successfully! Please check your email to verify your account.');
      } else {
        setSuccess('Login successful! Redirecting...');
      }
      console.log('Form submitted:', data);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    console.log('Google login initiated');
    setSuccess('Google login initiated...');
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthForm
        mode={mode}
        onSubmit={handleSubmit}
        onGoogleLogin={handleGoogleLogin}
        onModeChange={setMode}
        isLoading={loading}
        error={error}
        success={success}
      />
    </div>
  );
}