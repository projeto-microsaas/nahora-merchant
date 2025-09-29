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
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import axios from '@/lib/axios';
import styles from '@/pages/auth/RegisterPage.module.css';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres.' }),
  email: z.string().email({ message: 'E-mail inválido.' }),
  password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
  confirmPassword: z.string().min(6, { message: 'Confirmação de senha é obrigatória.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '' 
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log('Dados enviados para registro:', data);
      const response = await axios.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });
      console.log('Resposta do registro:', response.data);
      toast.success('Usuário registrado com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Erro no registro:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Erro ao registrar usuário.';
      toast.error(`Erro ao registrar: ${errorMessage}`);
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
          <h1 className={styles.title || 'title-fallback'}>Criar Conta</h1>
          <p className={styles.subtitle || 'subtitle-fallback'}>Registre-se para começar a usar a plataforma</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form || 'form-fallback'}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className={styles.formItem || 'form-item-fallback'}>
                  <FormLabel className={styles.formLabel || 'form-label-fallback'}>Nome Completo</FormLabel>
                  <div className={styles.inputWrapper || 'input-wrapper-fallback'}>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} className={styles.input || 'input-fallback'} />
                    </FormControl>
                    <User className={styles.inputIcon || 'input-icon-fallback'} />
                  </div>
                  <FormMessage className={styles.errorMessage || 'error-message-fallback'} />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className={styles.formItem || 'form-item-fallback'}>
                  <FormLabel className={styles.formLabel || 'form-label-fallback'}>Confirmar Senha</FormLabel>
                  <div className={styles.inputWrapper || 'input-wrapper-fallback'}>
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className={styles.eyeIcon || 'eye-icon-fallback'} /> : <Eye className={styles.eyeIcon || 'eye-icon-fallback'} />}
                    </Button>
                  </div>
                  <FormMessage className={styles.errorMessage || 'error-message-fallback'} />
                </FormItem>
              )}
            />
            <Button type="submit" className={styles.submitButton || 'submit-button-fallback'}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
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
          onClick={() => toast.success('Registro com Google realizado com sucesso!')}
        >
          Google
        </Button>
        <div className={styles.loginContainer || 'login-container-fallback'}>
          <p className={styles.loginText || 'login-text-fallback'}>
            Já tem uma conta?{' '}
            <Button
              type="button"
              variant="link"
              className={styles.loginLink || 'login-link-fallback'}
              onClick={() => navigate('/login')}
            >
              Faça login aqui
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;