import React, { useState } from 'react';
import { X, CreditCard, Lock, Calendar, CheckCircle, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: string;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, planName, price, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const [errors, setErrors] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'number':
        const cleanNumber = value.replace(/\s/g, '');
        if (cleanNumber.length !== 16) {
          error = 'Número do cartão incompleto.';
        }
        break;
        
      case 'expiry':
        if (value.length !== 5) {
          error = 'Data inválida.';
        } else {
          const [month, year] = value.split('/').map(Number);
          const now = new Date();
          const currentYear = Number(now.getFullYear().toString().slice(-2));
          const currentMonth = now.getMonth() + 1;

          if (!month || month < 1 || month > 12) {
            error = 'Mês inválido.';
          } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
            error = 'Cartão vencido.';
          }
        }
        break;
        
      case 'cvc':
        if (value.length < 3) {
          error = 'CVC incompleto.';
        }
        break;
        
      case 'name':
        if (value.trim().length < 3) {
          error = 'Insira o nome completo.';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateField(e.target.name, e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    // Masking Logic
    if (name === 'number') {
        value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    } else if (name === 'expiry') {
        value = value.replace(/\D/g, '').replace(/(.{2})/g, '$1/').slice(0, 5);
        if (value.endsWith('/')) value = value.slice(0, -1); 
    } else if (name === 'cvc') {
        value = value.replace(/\D/g, '').slice(0, 3);
    } else if (name === 'name') {
        value = value.toUpperCase();
    }

    setCardData({ ...cardData, [name]: value });
    
    // Clear error on change if it exists
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const isNumberValid = validateField('number', cardData.number);
    const isExpiryValid = validateField('expiry', cardData.expiry);
    const isCvcValid = validateField('cvc', cardData.cvc);
    const isNameValid = validateField('name', cardData.name);

    if (!isNumberValid || !isExpiryValid || !isCvcValid || !isNameValid) {
      return;
    }

    setLoading(true);

    // Simulação de delay de processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // 1. Verificar usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
          // 2. Atualizar metadados no Supabase
          const { error } = await supabase.auth.updateUser({
            data: { has_access: true, plan: planName }
          });
          if (error) throw error;

          // 3. CRÍTICO: Forçar atualização da sessão local para persistir o novo metadado (has_access)
          await supabase.auth.refreshSession();
      }

      setLoading(false);
      setSuccess(true);
      
      // 4. Feedback e Redirecionamento
      setTimeout(() => {
          onPaymentSuccess(); // Chama a função do pai que redireciona para 'modulos'
          onClose();
          setSuccess(false);
          setCardData({ number: '', name: '', expiry: '', cvc: '' });
          setErrors({ number: '', name: '', expiry: '', cvc: '' });
      }, 2000);

    } catch (error) {
      console.error("Erro no pagamento:", error);
      setLoading(false);
      alert("Erro ao processar pagamento. Tente novamente.");
    }
  };

  if (!isOpen) return null;

  // Helper para classes de input
  const getInputClass = (hasError: boolean) => `
    w-full px-4 py-3 border rounded-lg outline-none transition-all font-mono
    ${hasError 
      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50 text-red-900 placeholder-red-300' 
      : 'border-slate-300 focus:ring-2 focus:ring-slate-900'
    }
  `;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden gpu-accelerated"
          style={{ willChange: 'transform, opacity' }}
        >
          {success ? (
             <div className="p-12 flex flex-col items-center justify-center text-center">
                 <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                 >
                    <CheckCircle className="h-10 w-10 text-green-600" />
                 </motion.div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">Pagamento Aprovado!</h3>
                 <p className="text-slate-600">Seu acesso foi liberado com sucesso.</p>
                 <div className="mt-6 flex items-center gap-2 text-yellow-600 font-medium animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Redirecionando para o curso...</span>
                 </div>
             </div>
          ) : (
             <>
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-green-400" />
                        <h3 className="font-bold text-lg">Checkout Seguro</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-slate-600 text-sm">Resumo do pedido</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-900 text-lg">{planName}</h4>
                        <span className="font-bold text-green-600 text-xl">R$ {price},00</span>
                    </div>
                </div>

                <form onSubmit={handlePayment} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Número do Cartão</label>
                        <div className="relative">
                            <CreditCard className={`absolute left-3 top-3.5 h-5 w-5 ${errors.number ? 'text-red-400' : 'text-slate-400'}`} />
                            <input 
                                type="text" 
                                name="number"
                                placeholder="0000 0000 0000 0000"
                                className={`${getInputClass(!!errors.number)} pl-10 pr-10`}
                                value={cardData.number}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                required
                            />
                            {errors.number && (
                                <AlertCircle className="absolute right-3 top-3.5 h-5 w-5 text-red-500" />
                            )}
                        </div>
                        {errors.number && <p className="text-xs text-red-500 mt-1 font-medium">{errors.number}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Validade</label>
                            <div className="relative">
                                <Calendar className={`absolute left-3 top-3.5 h-5 w-5 ${errors.expiry ? 'text-red-400' : 'text-slate-400'}`} />
                                <input 
                                    type="text" 
                                    name="expiry"
                                    placeholder="MM/AA"
                                    className={`${getInputClass(!!errors.expiry)} pl-10`}
                                    value={cardData.expiry}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    maxLength={5}
                                    required
                                />
                            </div>
                            {errors.expiry && <p className="text-xs text-red-500 mt-1 font-medium">{errors.expiry}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVC</label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-3.5 h-5 w-5 ${errors.cvc ? 'text-red-400' : 'text-slate-400'}`} />
                                <input 
                                    type="text" 
                                    name="cvc"
                                    placeholder="123"
                                    className={`${getInputClass(!!errors.cvc)} pl-10`}
                                    value={cardData.cvc}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    maxLength={3}
                                    required
                                />
                            </div>
                            {errors.cvc && <p className="text-xs text-red-500 mt-1 font-medium">{errors.cvc}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome no Cartão</label>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="COMO ESTÁ NO CARTÃO"
                            className={`${getInputClass(!!errors.name)} font-sans`} // Name doesn't need mono font
                            value={cardData.name}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                        />
                         {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                        {loading ? 'Processando...' : `Pagar R$ ${price},00`}
                    </button>
                    
                    <div className="flex justify-center items-center gap-2 text-xs text-slate-400 mt-2">
                        <Lock className="h-3 w-3" />
                        Ambiente criptografado de ponta a ponta
                    </div>
                </form>
             </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};