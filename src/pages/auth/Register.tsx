import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useRegister } from '../../hooks/useRegister';
import { Footer } from '../../components/ui/Footer';
import { Header } from '../../components/ui/Header';

export function Register() {
    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        apiError,
        getValues
    } = useRegister();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-medical-50 via-primary-50 to-medical-50">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-2xl">
                    {/* Logo and Title */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl shadow-xl mb-6 relative">
                            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                            <svg className="w-12 h-12 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-medical-900 mb-2">
                            Crie sua conta
                        </h2>
                        <p className="text-medical-600">
                            Cadastre-se para agendar suas consultas
                        </p>
                    </div>

                    {/* Register Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-medical-200/50 backdrop-blur-sm">
                        {/* Error Alert */}
                        {apiError && (
                            <div className="mb-6 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg flex items-start gap-3">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">{apiError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input
                                    label="Nome Completo"
                                    type="text"
                                    placeholder="João Silva"
                                    error={errors.name?.message}
                                    {...register("name", {
                                        required: "O nome é obrigatório"
                                    })}
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    error={errors.email?.message}
                                    {...register("email", {
                                        required: "O email é obrigatório",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Email inválido"
                                        }
                                    })}
                                />

                                <Input
                                    label="CPF"
                                    type="text"
                                    placeholder="000.000.000-00"
                                    error={errors.cpf?.message}
                                    {...register("cpf", {
                                        required: "O CPF é obrigatório",
                                        pattern: {
                                            value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                                            message: "CPF deve estar no formato 000.000.000-00"
                                        }
                                    })}
                                />

                                <Input
                                    label="Data de Nascimento"
                                    type="date"
                                    error={errors.birthDate?.message}
                                    {...register("birthDate", {
                                        required: "A data de nascimento é obrigatória",
                                        validate: (value) => {
                                            const date = new Date(value);
                                            const today = new Date();
                                            return date < today || "Data de nascimento deve ser no passado";
                                        }
                                    })}
                                />

                                <Input
                                    label="Senha"
                                    type="password"
                                    placeholder="••••••••"
                                    error={errors.password?.message}
                                    {...register("password", {
                                        required: "A senha é obrigatória",
                                        minLength: {
                                            value: 6,
                                            message: "A senha deve ter pelo menos 6 caracteres"
                                        }
                                    })}
                                />

                                <Input
                                    label="Confirmar Senha"
                                    type="password"
                                    placeholder="••••••••"
                                    error={errors.confirmPassword?.message}
                                    {...register("confirmPassword", {
                                        required: "A confirmação de senha é obrigatória",
                                        validate: (value) => value === getValues('password') || "As senhas não coincidem"
                                    })}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                isLoading={isSubmitting}
                                className="w-full"
                            >
                                Cadastrar
                            </Button>

                            <div className="text-center pt-4">
                                <p className="text-sm text-medical-600">
                                    Já tem uma conta?{' '}
                                    <Link
                                        to="/"
                                        className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                                    >
                                        Faça login
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
