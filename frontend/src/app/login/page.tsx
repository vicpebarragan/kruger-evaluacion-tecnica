'use client';

import { FormProvider } from '@/components/providers/FormProvider';
import { useFormWithSchema } from '@/hooks/useFormWithSchema';
import { useAuthStore } from '@/store';
import { loginSchema } from '@/utils/schemas';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Input, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

const { Title, Text } = Typography;

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();

    const methods = useFormWithSchema({
        schema: loginSchema,
        defaultValues: {
            email: 'prueba@email.com',
            password: 'prueba',
        },
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            clearError();
            await login(data);
            message.success('¡Inicio de sesión exitoso!');
            router.push('/dashboard');
        } catch (error: unknown) {
            console.error('Login error:', error);
            message.error('Error al iniciar sesión');
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10'></div>
            <div className='absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2'></div>
            <div className='absolute bottom-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2'></div>

            <div className='w-full max-w-md relative z-10'>
                <Card
                    className='shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/50'
                    styles={{
                        body: { padding: '3rem 2rem' },
                    }}
                >
                    <div className='text-center mb-8'>
                        <div className='w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/25'>
                            <UserOutlined className='text-white text-3xl' />
                        </div>
                        <Title level={2} className='mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent'>
                            Bienvenido
                        </Title>
                        <Text className='text-slate-400 text-base'>
                            Inicia sesión para acceder al sistema
                        </Text>
                    </div>

                    {error && (
                        <Alert
                            message={error}
                            type='error'
                            showIcon
                            closable
                            onClose={clearError}
                        />
                    )}

                    <FormProvider
                        formMethods={methods}
                        onSubmit={onSubmit}
                        className='space-y-6'
                    >
                        <div>
                            <label className='block text-slate-300 mb-2 font-medium'>
                                Correo Electrónico
                            </label>
                            <Controller
                                name="email"
                                control={methods.control}
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        prefix={<UserOutlined className='text-slate-400' />}
                                        placeholder='prueba@email.com'
                                        size='large'
                                        className='bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 hover:border-purple-500 focus:border-purple-500 transition-colors'
                                        status={fieldState.error ? 'error' : ''}
                                    />
                                )}
                            />
                            {methods.formState.errors.email && (
                                <p className='text-red-400 text-sm mt-2 flex items-center'>
                                    <span className='mr-1'>⚠️</span>
                                    {methods.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className='block text-slate-300 mb-2 font-medium'>
                                Contraseña
                            </label>
                            <Controller
                                name="password"
                                control={methods.control}
                                render={({ field, fieldState }) => (
                                    <Input.Password
                                        {...field}
                                        prefix={<LockOutlined className='text-slate-400' />}
                                        placeholder='Ingresa tu contraseña'
                                        size='large'
                                        className='bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 hover:border-purple-500 focus:border-purple-500 transition-colors'
                                        iconRender={(visible) =>
                                            visible ? <EyeTwoTone className='text-slate-400' /> : <EyeInvisibleOutlined className='text-slate-400' />
                                        }
                                        status={fieldState.error ? 'error' : ''}
                                    />
                                )}
                            />
                            {methods.formState.errors.password && (
                                <p className='text-red-400 text-sm mt-2 flex items-center'>
                                    <span className='mr-1'>⚠️</span>
                                    {methods.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type='primary'
                            htmlType='submit'
                            size='large'
                            loading={isLoading}
                            className='w-full bg-gradient-to-r from-purple-500 to-blue-500 border-0 hover:from-purple-600 hover:to-blue-600 h-12 font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]'
                            style={{
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                            }}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </FormProvider>

                </Card>

                {/* Footer */}
                <div className='text-center mt-6'>
                    <Text className='text-slate-500 text-sm'>
                        Prueba Técnica - Next.js 13+ con Autenticación JWT
                    </Text>
                </div>
            </div>
        </div>
    );
}
