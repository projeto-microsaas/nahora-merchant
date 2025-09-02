import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import axios from '@/lib/axios';
import styles from '@/pages/auth/LoginPage.module.css';

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log('Dados enviados para login:', data); // Depuração detalhada
      const response = await axios.post('/api/auth/login', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { token } = response.data;
      if (!token) throw new Error('Token não retornado pelo servidor');
      localStorage.setItem('authToken', token);
      console.log('Login bem-sucedido. Token salvo:', token);
      toast.success('Login realizado com sucesso!');
      navigate('/deliveries');
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      toast.error(`Erro ao fazer login: ${errorMessage}`);
      form.setError('root.serverError', { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container || 'container-fallback'}>
      <div className={styles.formContainer || 'form-container-fallback'}>
        <div className={styles.header || 'header-fallback'}>
          <img src="/logo.png" alt="Logo da Plataforma" className={styles.logo || 'logo-fallback'} />
          <h1 className={styles.title || 'title-fallback'}>Login</h1>
          <p className={styles.subtitle || 'subtitle-fallback'}>Faça login para acessar sua conta</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form || 'form-fallback'}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={styles.formItem || 'form-item-fallback'}>
                  <FormLabel className={styles.formLabel || 'form-label-fallback'}>E-mail</FormLabel>
                  <div className={styles.inputWrapper || 'input-wrapper-fallback'}>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} className={styles.input || 'input-fallback'} />
                    </FormControl>
                    <Mail className={styles.inputIcon || 'input-icon-fallback'} />
                  </div>
                  <FormMessage className={styles.errorMessage || 'error-message-fallback'} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className={styles.formItem || 'form-item-fallback'}>
                  <FormLabel className={styles.formLabel || 'form-label-fallback'}>Senha</FormLabel>
                  <div className={styles.inputWrapper || 'input-wrapper-fallback'}>
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                        className={styles.input || 'input-fallback'}
                      />
                    </FormControl>
                    <Lock className={styles.inputIcon || 'input-icon-fallback'} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={styles.passwordToggle || 'password-toggle-fallback'}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className={styles.eyeIcon || 'eye-icon-fallback'} /> : <Eye className={styles.eyeIcon || 'eye-icon-fallback'} />}
                    </Button>
                  </div>
                  <FormMessage className={styles.errorMessage || 'error-message-fallback'} />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="link"
              className={styles.forgotPassword || 'forgot-password-fallback'}
              onClick={() => navigate('/reset-password')}
            >
              Esqueceu sua senha?
            </Button>
            <Button type="submit" className={styles.submitButton || 'submit-button-fallback'}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>
        <div className={styles.divider || 'divider-fallback'}>
          <Separator />
          <span className={styles.dividerText || 'divider-text-fallback'}>OU CONTINUE COM</span>
        </div>
        <Button
          type="button"
          variant="outline"
          className={styles.googleButton || 'google-button-fallback'}
          onClick={() => toast.success('Login com Google realizado com sucesso!')}
        >
          Google
        </Button>
        <div className={styles.registerContainer || 'register-container-fallback'}>
          <p className={styles.registerText || 'register-text-fallback'}>
            Não tem uma conta?{' '}
            <Button
              type="button"
              variant="link"
              className={styles.registerLink || 'register-link-fallback'}
              onClick={() => navigate('/register')}
            >
              Registre-se
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;