import React, { useState } from 'react';
import { X, CreditCard, Lock, Calendar, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.name === 'number') {
        value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    } else if (e.target.name === 'expiry') {
        value = value.replace(/\D/g, '').replace(/(.{2})/g, '$1/').slice(0, 5);
        if (value.endsWith('/')) value = value.slice(0, -1); 
    } else if (e.target.name === 'cvc') {
        value = value.replace(/\D/g, '').slice(0, 3);
    } else if (e.target.name === 'name') {
        value = value.toUpperCase();
    }
    setCardData({ ...cardData, [e.target.name]: value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de delay de processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Atualiza os metadados do usuário para liberar o acesso
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
          const { error } = await supabase.auth.updateUser({
            data: { has_access: true, plan: planName }
          });
          if (error) throw error;
      }

      setLoading(false);
      setSuccess(true);
      
      // Notifica o componente pai e fecha
      setTimeout(() => {
          onPaymentSuccess();
          onClose();
          setSuccess(false);
          setCardData({ number: '', name: '', expiry: '', cvc: '' });
      }, 2500);

    } catch (error) {
      console.error("Erro no pagamento:", error);
      setLoading(false);
      alert("Erro ao processar pagamento. Tente novamente.");
    }
  };

  if (!isOpen) return null;

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
                 <p className="text-slate-600">Seu acesso ao curso foi liberado.</p>
                 <p className="text-sm text-slate-400 mt-4">Redirecionando...</p>
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
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input 
                                type="text" 
                                name="number"
                                placeholder="0000 0000 0000 0000"
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all font-mono"
                                value={cardData.number}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Validade</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input 
                                    type="text" 
                                    name="expiry"
                                    placeholder="MM/AA"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all font-mono"
                                    value={cardData.expiry}
                                    onChange={handleInputChange}
                                    maxLength={5}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVC</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input 
                                    type="text" 
                                    name="cvc"
                                    placeholder="123"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all font-mono"
                                    value={cardData.cvc}
                                    onChange={handleInputChange}
                                    maxLength={3}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome no Cartão</label>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="COMO ESTÁ NO CARTÃO"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                            value={cardData.name}
                            onChange={handleInputChange}
                            required
                        />
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