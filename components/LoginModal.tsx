import React, { useState } from 'react';
import { X, Loader2, LogIn, Mail, Lock, UserPlus, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Resend Logic State
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleResendEmail = async () => {
      if (resendCooldown || isResending) return;
      
      setIsResending(true);
      try {
          const { error } = await supabase.auth.resend({
              type: 'signup',
              email: formData.email,
              options: {
                  emailRedirectTo: window.location.origin
              }
          });
          
          if (error) throw error;
          
          alert('E-mail de confirmação reenviado com sucesso! Verifique sua caixa de entrada e Spam.');
          setResendCooldown(true);
          // Cooldown de 60 segundos
          setTimeout(() => setResendCooldown(false), 60000);
      } catch (err: any) {
          console.error("Erro ao reenviar:", err);
          alert(err.message || "Erro ao reenviar e-mail. Tente novamente mais tarde.");
      } finally {
          setIsResending(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isSignUp) {
        // Criar conta
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
             // Redirecionamento para a origem atual
             emailRedirectTo: window.location.origin, 
             data: { has_access: false } 
          }
        });
        if (error) {
             // Tratamento específico para usuário já existente
             if (error.message.includes("already registered") || error.status === 400) {
                 throw new Error("Este e-mail já está cadastrado. Tente fazer login ou recupere sua senha.");
             }
             throw error;
        }
        setSuccessMessage('Conta criada! Verifique seu e-mail para ativar o acesso.');
      } else {
        // Fazer Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        setSuccessMessage('Login realizado com sucesso!');
      }

      setStatus('success');
      
      // Se for Login, fecha rápido. Se for Cadastro, mantemos aberto para instrução de email.
      if (!isSignUp) {
        setTimeout(() => {
            setStatus('idle');
            setFormData({ email: '', password: '' });
            onClose();
            if (onLoginSuccess) onLoginSuccess();
        }, 1500);
      }
      
    } catch (error: any) {
      console.error('Auth error:', error);
      setStatus('error');
      // Tradução amigável de erros comuns
      let msg = error.message;
      if (msg === "Invalid login credentials") msg = "E-mail ou senha incorretos.";
      if (msg.includes("Email not confirmed")) msg = "E-mail não confirmado. Verifique sua caixa de entrada.";
      setErrorMessage(msg);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage('');
    setSuccessMessage('');
    setStatus('idle');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden gpu-accelerated"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                {isSignUp ? <UserPlus className="h-5 w-5 text-yellow-500" /> : <LogIn className="h-5 w-5 text-yellow-500" />}
                <h3 className="text-xl font-bold">{isSignUp ? 'Criar Conta' : 'Área do Aluno'}</h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
                {status === 'success' ? (
                     <div className="flex flex-col items-center text-center py-4 animate-in fade-in zoom-in duration-300">
                        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                        <p className="text-slate-800 font-medium text-lg mb-2">{isSignUp ? 'Quase lá!' : 'Sucesso!'}</p>
                        <p className="text-slate-600 text-sm mb-6">{successMessage}</p>
                        
                        {isSignUp && (
                            <div className="bg-slate-50 p-4 rounded-lg w-full border border-slate-100">
                                <p className="text-xs text-slate-500 mb-3">
                                    Enviamos um link de confirmação para:<br/>
                                    <strong>{formData.email}</strong>
                                </p>
                                <p className="text-xs text-slate-400 mb-4 italic">
                                    Não esqueça de checar a caixa de Spam/Lixo Eletrônico.
                                </p>
                                
                                <button 
                                    onClick={handleResendEmail}
                                    disabled={resendCooldown || isResending}
                                    className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isResending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                                    {resendCooldown ? 'Aguarde para reenviar...' : 'Não recebeu? Reenviar e-mail'}
                                </button>
                            </div>
                        )}
                     </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                                placeholder="seu@email.com"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                required
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                                placeholder="••••••••"
                                minLength={6}
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs flex items-center gap-2 text-left">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{errorMessage}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                isSignUp ? 'Cadastrar' : 'Entrar'
                            )}
                        </button>
                    </form>
                )}

                {/* Footer Toggle */}
                {status !== 'success' && (
                    <div className="mt-6 text-center pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-600">
                            {isSignUp ? 'Já tem uma conta?' : 'Ainda não é aluno?'}
                            <button 
                                onClick={toggleMode}
                                className="ml-1 text-yellow-600 font-bold hover:text-yellow-700 hover:underline transition-colors"
                            >
                                {isSignUp ? 'Fazer Login' : 'Criar conta de acesso'}
                            </button>
                        </p>
                    </div>
                )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};