import React, { useState, useEffect } from 'react';
import { Menu, X, Gavel, Brain, Shield, Rocket, CheckCircle, ChevronDown, MessageSquare, Quote, ChevronLeft, ChevronRight, Linkedin, Instagram, Loader2, LogIn, Lock, Award, GraduationCap, Star, Clock, Zap, ArrowRight, PlayCircle, ShieldCheck, Search, HelpCircle, Timer, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { CourseModules, FAQData, PricingPlans, TestimonialsData, InstructorData } from './constants';
import { supabase } from './lib/supabaseClient';

// Importações estáticas
import { ChatWidget } from './components/ChatWidget';
import { EnrollmentModal } from './components/EnrollmentModal';
import { LoginModal } from './components/LoginModal';
import { PaymentModal } from './components/PaymentModal';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // User & Access State
  const [user, setUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  
  // Modal States
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false); 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  // Selection State
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [pendingPlan, setPendingPlan] = useState<{name: string, price: string} | null>(null);

  // Timer State for Urgency
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });

  const location = useLocation();
  const navigate = useNavigate();

  // Countdown Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) return { minutes: 15, seconds: 0 }; // Reset for scarcity loop
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check User Session and Access on Mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user?.user_metadata?.has_access) {
        setHasAccess(true);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        // Included USER_UPDATED to catch changes made by PaymentModal
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            setUser(session?.user ?? null);
            if (session?.user?.user_metadata?.has_access) {
                setHasAccess(true);
            } else {
                setHasAccess(false);
            }
        } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setHasAccess(false);
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const sectionId = location.pathname.replace('/', '');
    if (sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  // Reset image loading state when testimonial changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [currentTestimonialIndex]);

  const toggleModule = (index: number) => {
    if (!hasAccess) {
        return;
    }
    setOpenModuleIndex(openModuleIndex === index ? null : index);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    navigate(`/${id}`);
    setIsMobileMenuOpen(false);
  };

  const handleStartNow = (planName: string, price: string) => {
    if (!user) {
        setPendingPlan({ name: planName, price: price });
        setIsLoginOpen(true);
    } else {
        setSelectedPlan(planName);
        setSelectedPrice(price);
        setIsPaymentOpen(true);
    }
  };

  const handleLoginSuccess = () => {
      if (pendingPlan) {
          setSelectedPlan(pendingPlan.name);
          setSelectedPrice(pendingPlan.price);
          setIsPaymentOpen(true);
          setPendingPlan(null); 
      }
  };

  const handlePaymentSuccess = () => {
      setHasAccess(true);
      scrollToSection('modulos');
  };

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % TestimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + TestimonialsData.length) % TestimonialsData.length);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setIsMobileMenuOpen(false);
  };

  // Filter Modules Logic
  const filteredModules = CourseModules.filter(module => {
    const query = searchQuery.toLowerCase();
    const titleMatch = module.title.toLowerCase().includes(query);
    const lessonMatch = module.lessons.some(lesson => lesson.toLowerCase().includes(query));
    return titleMatch || lessonMatch;
  });

  // Variantes de animação
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Urgency Banner */}
      {!hasAccess && (
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-4 text-center text-sm font-medium z-[60] relative shadow-md">
            <div className="flex items-center justify-center gap-2 animate-pulse">
                <Timer className="h-4 w-4" />
                <span>Oferta Especial termina em: <span className="font-mono font-bold text-yellow-300">{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span></span>
            </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                <Brain className="h-6 w-6 text-yellow-500" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight font-serif">Juris<span className="text-yellow-600">Academy</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('sobre')} className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm uppercase tracking-wide">Sobre</button>
              <button onClick={() => scrollToSection('instrutor')} className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm uppercase tracking-wide">Instrutor</button>
              <button onClick={() => scrollToSection('modulos')} className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm uppercase tracking-wide">Conteúdo</button>
              
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              
              {user ? (
                 <div className="flex items-center gap-2 text-slate-900 font-medium bg-slate-100 pl-2 pr-4 py-1.5 rounded-full border border-slate-200">
                    <div className="w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center text-slate-900 font-bold shadow-sm text-xs">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm hidden lg:inline truncate max-w-[120px]">{user.email?.split('@')[0]}</span>
                 </div>
              ) : (
                <button onClick={handleLoginClick} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors">
                    <LogIn className="h-4 w-4" />
                    Entrar
                </button>
              )}
              
              {!hasAccess && (
                  <button onClick={() => scrollToSection('pricing')} className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 transform duration-200 hover:-translate-y-0.5 border border-transparent hover:border-yellow-500/30">
                    Matricule-se
                  </button>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-900 p-2">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button onClick={() => scrollToSection('sobre')} className="block w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-md hover:text-yellow-600 transition-colors">Sobre o Curso</button>
                <button onClick={() => scrollToSection('instrutor')} className="block w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-md hover:text-yellow-600 transition-colors">O Instrutor</button>
                <button onClick={() => scrollToSection('modulos')} className="block w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-md hover:text-yellow-600 transition-colors">Conteúdo</button>
                <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-md hover:text-yellow-600 transition-colors">FAQ</button>
                <button onClick={handleLoginClick} className="block w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 font-medium flex items-center gap-2 rounded-md hover:text-yellow-600 transition-colors">
                   <LogIn className="h-4 w-4" />
                   {user ? 'Minha Conta' : 'Entrar / Área do Aluno'}
                </button>
                {!hasAccess && (
                  <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-3 py-2 text-yellow-600 font-bold hover:bg-slate-50 rounded-md hover:text-yellow-700 transition-colors">Inscreva-se Agora</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white pt-24 pb-36 overflow-hidden min-h-[90vh] flex items-center">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
            <div className="absolute top-[-10%] right-[20%] w-[400px] h-[400px] bg-yellow-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-slate-700 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-md mb-8 hover:bg-slate-800/80 transition-colors cursor-default"
            >
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${i+50}/100`} className="w-full h-full object-cover" />
                     </div>
                 ))}
              </div>
              <div className="flex items-center gap-1 ml-2">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              </div>
              <span className="text-xs text-slate-300 font-medium ml-1">+1.500 Alunos</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] font-serif mb-6 tracking-tight">
              A Evolução da <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 text-glow">Advocacia Digital</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Não seja substituído pela tecnologia. <strong className="text-white font-semibold">Seja potencializado por ela.</strong> Domine IA Generativa, automatize petições e torne seu escritório 10x mais produtivo e lucrativo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {!hasAccess ? (
                  <button onClick={() => scrollToSection('pricing')} className="group relative px-8 py-4 bg-yellow-500 text-slate-950 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)] hover:shadow-[0_0_60px_-15px_rgba(234,179,8,0.7)] flex items-center justify-center gap-2 overflow-hidden">
                    <span className="relative z-10">Quero Dominar a IA</span>
                    <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
              ) : (
                  <button onClick={() => scrollToSection('modulos')} className="px-8 py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                    <PlayCircle className="h-5 w-5" />
                    Continuar Curso
                  </button>
              )}
              <button onClick={() => scrollToSection('modulos')} className="px-8 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors backdrop-blur-sm">
                Ver Ementa Completa
              </button>
            </div>
            
            <p className="mt-6 text-sm text-slate-500 flex items-center justify-center lg:justify-start gap-2">
                <ShieldCheck className="h-4 w-4" />
                Garantia de 7 dias ou seu dinheiro de volta
            </p>
          </motion.div>

          {/* Right Visual - Dynamic Interface Comparison */}
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
             <div className="relative">
                {/* Main Visual Card */}
                <div className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden aspect-[4/3] group">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 z-0"></div>
                    
                    {/* Simulated Interface */}
                    <div className="absolute inset-0 p-6 flex flex-col z-10">
                        <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div className="ml-4 h-2 w-32 bg-slate-800 rounded-full"></div>
                        </div>
                        
                        <div className="flex-1 flex gap-4">
                            {/* Sidebar */}
                            <div className="w-1/4 space-y-3 hidden sm:block">
                                <div className="h-2 w-full bg-slate-800 rounded animate-pulse"></div>
                                <div className="h-2 w-2/3 bg-slate-800 rounded animate-pulse delay-75"></div>
                                <div className="h-2 w-3/4 bg-slate-800 rounded animate-pulse delay-150"></div>
                            </div>
                            {/* Main Content Area */}
                            <div className="flex-1 bg-slate-950/50 rounded-lg border border-slate-800 p-4 font-mono text-xs text-slate-400 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent animate-[shimmer_2s_infinite]"></div>
                                <p className="mb-2 text-yellow-500">> Iniciando análise jurisprudencial...</p>
                                <p className="mb-2">> Varrendo base de dados STJ/STF...</p>
                                <p className="mb-2">> Identificando precedentes favoráveis...</p>
                                <p className="text-white font-bold typewriter">
                                    > EUREKA! Encontrados 3 precedentes qualificados para a tese. <br/>
                                    > Gerando minuta da petição... (100%)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Comparison Card 1 (Bad) */}
                <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute -top-6 -right-4 sm:-right-8 bg-white p-4 rounded-xl shadow-xl border border-slate-100 w-48 z-20 transform rotate-3 hover:rotate-0 transition-transform duration-300"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <Clock className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Sem IA</p>
                            <p className="text-sm font-bold text-slate-900">4 Horas</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[90%]"></div>
                    </div>
                </motion.div>

                {/* Floating Comparison Card 2 (Good) */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="absolute -bottom-8 -left-4 sm:-left-8 bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-700 w-56 z-20 transform -rotate-2 hover:rotate-0 transition-transform duration-300"
                >
                     <div className="absolute -top-3 -right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                        16x Mais Rápido
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-green-500/20 p-2 rounded-lg">
                            <Zap className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Com JurisAcademy</p>
                            <p className="text-sm font-bold text-white">15 Minutos</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[15%]"></div>
                    </div>
                </motion.div>
             </div>
          </motion.div>
        </div>
        
        {/* Scrolldown Indicator */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={() => scrollToSection('sobre')}
        >
            <span className="text-xs uppercase tracking-widest text-slate-500">Saiba mais</span>
            <ChevronDown className="h-5 w-5 text-slate-500 animate-bounce" />
        </motion.div>
      </section>

      {/* Benefits / Statistics */}
      <section id="sobre" className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-yellow-600 font-bold tracking-wider text-sm uppercase">Por que escolher a JurisAcademy?</span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">A Ponte entre o Direito e a Tecnologia</h2>
            </div>
            
            <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            >
            {[
                { icon: Gavel, title: "Metodologia Prática", desc: "Aprenda aplicando em casos reais. Nada de teoria excessiva. Focamos no que gera resultado no seu escritório amanhã." },
                { icon: Brain, title: "Tecnologia de Ponta", desc: "Domine ChatGPT, Gemini, NotebookLM e outras ferramentas essenciais com prompts testados e validados juridicamente." },
                { icon: Shield, title: "Ética e Segurança", desc: "Aprenda a usar IA sem ferir o código de ética da OAB ou expor dados sensíveis de clientes. Compliance total." }
            ].map((item, idx) => (
                <motion.div 
                key={idx} 
                variants={fadeInUp}
                className="group bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-yellow-200 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 gpu-accelerated"
                >
                <div className="bg-white p-4 rounded-xl mb-6 border border-slate-100 w-fit group-hover:bg-yellow-50 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-8 w-8 text-slate-700 group-hover:text-yellow-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
            ))}
            </motion.div>
        </div>
      </section>

      {/* Instructor Section (NEW) */}
      <section id="instrutor" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row items-center gap-12">
               <motion.div 
                 className="md:w-1/2 relative"
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.7 }}
               >
                   <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-slate-100 group">
                        <img 
                            src={InstructorData.image} 
                            alt={InstructorData.name}
                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   </div>
                   {/* Decorative elements */}
                   <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-100 rounded-full -z-0"></div>
                   <div className="absolute -top-6 -left-6 w-24 h-24 bg-slate-100 rounded-full -z-0"></div>
               </motion.div>

               <motion.div 
                 className="md:w-1/2"
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.7, delay: 0.2 }}
               >
                   <div className="flex items-center gap-2 text-yellow-600 font-bold uppercase tracking-wider text-sm mb-4">
                        <GraduationCap className="h-5 w-5" />
                        <span>Seu Mentor</span>
                   </div>
                   <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-serif">{InstructorData.name}</h2>
                   <h3 className="text-xl text-slate-600 font-medium mb-6 flex items-center gap-2">
                       {InstructorData.role}
                   </h3>
                   <p className="text-slate-600 text-lg leading-relaxed mb-8 border-l-4 border-yellow-500 pl-4">
                       {InstructorData.bio}
                   </p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {InstructorData.achievements.map((item, idx) => (
                           <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                               <div className="mt-1 bg-green-100 p-1 rounded-full flex-shrink-0">
                                   <Star className="h-3 w-3 text-green-600" />
                               </div>
                               <span className="text-slate-700 font-medium text-sm">{item}</span>
                           </div>
                       ))}
                   </div>
               </motion.div>
           </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="modulos" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">O que você vai aprender</h2>
            <p className="text-slate-600 text-lg">Um programa completo, do básico ao avançado, desenhado para juristas.</p>
            {!hasAccess && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg inline-flex items-center gap-2 text-sm border border-yellow-200 shadow-sm">
                    <Lock className="h-4 w-4" />
                    Conteúdo disponível apenas para alunos matriculados
                </div>
            )}
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Pesquisar por aulas, temas ou conteúdos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all shadow-sm text-slate-700 placeholder:text-slate-400"
              />
          </motion.div>

          <div className="space-y-6">
            {filteredModules.length > 0 ? (
                filteredModules.map((module, index) => (
                <motion.div 
                    key={index} 
                    className={`bg-white rounded-xl border overflow-hidden transition-all duration-300 ${hasAccess ? 'border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300' : 'border-slate-100 opacity-80'}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                    <button
                    onClick={() => toggleModule(index)}
                    className={`w-full px-6 py-6 flex justify-between items-center bg-white transition-colors duration-200 ${hasAccess ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-not-allowed hover:bg-slate-50'}`}
                    title={!hasAccess ? "Matricule-se para acessar" : ""}
                    >
                    <div className="flex items-center gap-5 text-left">
                        <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${hasAccess ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {hasAccess ? index + 1 : <Lock className="h-4 w-4" />}
                        </span>
                        <h3 className={`text-lg font-bold ${hasAccess ? 'text-slate-900' : 'text-slate-500'}`}>{module.title}</h3>
                    </div>
                    {hasAccess ? (
                        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${openModuleIndex === index ? 'rotate-180' : ''}`} />
                    ) : (
                        <span className="text-xs text-yellow-600 font-bold uppercase tracking-wider bg-yellow-100 px-3 py-1 rounded-full">Bloqueado</span>
                    )}
                    </button>
                    {/* Only Show Content if Has Access */}
                    <AnimatePresence>
                        {hasAccess && openModuleIndex === index && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                        >
                            <div className="px-6 pb-8 pt-4 ml-12 border-l-2 border-slate-100">
                                <ul className="space-y-4">
                                {module.lessons.map((lesson, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-600 group">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                    <span className="group-hover:text-slate-900 transition-colors">{lesson}</span>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                ))
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                    <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Search className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">Nenhum conteúdo encontrado para "{searchQuery}"</p>
                    <p className="text-slate-400 text-sm mt-1">Tente buscar por outros termos.</p>
                </div>
            )}
          </div>
          {!hasAccess && (
              <div className="text-center mt-12">
                   <button onClick={() => scrollToSection('pricing')} className="px-8 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg">
                       Liberar Acesso Completo
                   </button>
              </div>
          )}
        </div>
      </section>

      {/* Certificate Section (NEW) */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/30 transform skew-x-12"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-12">
                  <motion.div 
                    className="md:w-1/2"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                      <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold mb-6">
                          <Award className="h-4 w-4" />
                          <span>Certificação Oficial</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold mb-6 font-serif">Comprove sua Nova Habilidade</h2>
                      <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                          Ao concluir o curso, você receberá um certificado de 40 horas, válido em todo território nacional como curso livre e atividade complementar.
                          Destaque-se no LinkedIn e mostre ao mercado que você domina a tecnologia jurídica.
                      </p>
                      <ul className="space-y-4">
                          <li className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-yellow-500" />
                              <span>Selo de verificação digital (QR Code)</span>
                          </li>
                          <li className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-yellow-500" />
                              <span>Ementa detalhada no verso</span>
                          </li>
                          <li className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-yellow-500" />
                              <span>Aceito pela maioria das Seccionais da OAB como horas complementares</span>
                          </li>
                      </ul>
                  </motion.div>
                  <motion.div 
                    className="md:w-1/2 relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                      <div className="bg-white p-2 rounded-lg shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 cursor-default">
                          <div className="border-4 border-slate-200 p-8 text-center bg-slate-50 relative">
                               <div className="absolute top-4 left-4 w-16 h-16 opacity-10">
                                   <Brain className="w-full h-full text-slate-900" />
                               </div>
                               <h3 className="text-2xl font-serif text-slate-900 font-bold mb-2">CERTIFICADO</h3>
                               <p className="text-xs text-slate-500 uppercase tracking-[0.2em] mb-8">De Conclusão</p>
                               
                               <p className="text-slate-600 text-sm mb-2">Certificamos que</p>
                               <p className="text-xl font-script text-slate-900 font-bold mb-4 font-serif italic">Seu Nome Aqui</p>
                               <p className="text-slate-600 text-sm mb-6 max-w-xs mx-auto">
                                   Concluiu com êxito o curso <strong className="text-slate-800">Direito e Inteligência Artificial</strong>, com carga horária de 40 horas.
                               </p>
                               
                               <div className="flex justify-between items-end mt-8 border-t border-slate-300 pt-4">
                                   <div className="text-left">
                                       <div className="h-8 w-24 bg-slate-200 mb-2"></div> 
                                       <p className="text-[10px] text-slate-400">Diretor Acadêmico</p>
                                   </div>
                                   <Award className="h-12 w-12 text-yellow-500" />
                               </div>
                          </div>
                      </div>
                  </motion.div>
              </div>
          </div>
      </section>

      {/* Pricing Section - OPTIMIZED FOR CONVERSION */}
      <section id="pricing" className="py-24 bg-slate-950 text-white relative overflow-hidden">
        {/* Optimized Background */}
        <div className="absolute inset-0 bg-slate-900">
             <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif">Acesso Imediato e Vitalício</h2>
            <p className="text-slate-300 text-lg">Invista na sua carreira pelo preço de um almoço por mês.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PricingPlans.map((plan, index) => (
              <motion.div 
                key={index} 
                className={`rounded-2xl p-8 relative gpu-accelerated transition-all duration-300 flex flex-col ${plan.highlight ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-yellow-500 shadow-[0_0_50px_-12px_rgba(234,179,8,0.25)] scale-105 z-10 ring-4 ring-yellow-500/10' : 'bg-slate-800 border border-slate-700 hover:border-slate-600'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                {plan.highlight && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-slate-900 px-6 py-2 rounded-full text-sm font-extrabold shadow-lg uppercase tracking-wide flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Recomendado
                  </div>
                )}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                    {plan.highlight && <p className="text-yellow-400 text-sm font-medium">Melhor custo-benefício</p>}
                </div>

                <div className="mb-8">
                    {plan.originalPrice && (
                        <p className="text-slate-500 line-through text-lg font-medium mb-1">De R$ {plan.originalPrice}</p>
                    )}
                    <div className="flex items-end gap-1">
                        <span className="text-sm text-slate-400 mb-6">Por 12x de</span>
                        {/* Calculate hypothetical installment for visual impact */}
                        <span className="text-6xl font-bold text-white">{(parseInt(plan.price) / 12).toFixed(2).replace('.', ',')}</span>
                        <span className="text-slate-400 mb-6">/mês</span>
                    </div>
                    <p className="text-slate-400 text-sm mt-2">ou R$ {plan.price} à vista</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className={`h-5 w-5 flex-shrink-0 ${plan.highlight ? 'text-yellow-500' : 'text-slate-500'}`} />
                      <span className="text-slate-300 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleStartNow(plan.name, plan.price)}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 active:scale-95 ${plan.highlight ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-xl shadow-yellow-500/20' : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600'}`}
                >
                  {hasAccess ? 'Acesso Liberado' : 'GARANTIR MINHA VAGA'}
                </button>
                {plan.highlight && (
                    <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                        <Lock className="h-3 w-3" /> Compra segura e criptografada
                    </p>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Enhanced Guarantee Badge */}
          <div className="mt-16 max-w-3xl mx-auto bg-slate-900/50 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm">
             <div className="flex-shrink-0">
                 <img src="https://cdn-icons-png.flaticon.com/512/9512/9512613.png" alt="Garantia" className="w-24 h-24 object-contain opacity-90 invert-[.1]" />
             </div>
             <div className="text-center md:text-left">
                 <h3 className="text-2xl font-bold text-white mb-2">Risco Zero: Garantia Blindada de 7 Dias</h3>
                 <p className="text-slate-400">
                     Acreditamos tanto no nosso método que tiramos o peso das suas costas. Matricule-se, assista às aulas, baixe os materiais. Se em 7 dias você achar que não valeu a pena, devolvemos 100% do seu dinheiro. Sem letras miúdas.
                 </p>
             </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div 
             className="text-center mb-12"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeInUp}
           >
             <div className="inline-flex items-center justify-center p-3 mb-6 bg-slate-100 rounded-full">
                <HelpCircle className="h-6 w-6 text-slate-600" />
             </div>
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-serif">Perguntas Frequentes</h2>
           </motion.div>
           
           <div className="space-y-4">
              {FAQData.map((faq, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={`border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'bg-slate-50 border-slate-300 shadow-sm' : 'bg-white hover:border-slate-300'}`}
                  >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                      >
                        <span className={`font-semibold text-lg ${openFaqIndex === index ? 'text-slate-900' : 'text-slate-700'}`}>
                            {faq.question}
                        </span>
                        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 text-yellow-600' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openFaqIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-200/50 pt-4">
                                {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                  </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
             <div className="inline-flex items-center justify-center p-3 mb-6 bg-yellow-100 rounded-full">
                <Quote className="h-6 w-6 text-yellow-600" />
             </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">Quem já revolucionou a advocacia</h2>
            <p className="text-slate-600 text-lg">Veja o que nossos alunos estão falando sobre a JurisAcademy.</p>
          </motion.div>

          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
             <div className="relative min-h-[300px] flex items-center justify-center">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={currentTestimonialIndex}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.3 }}
                   className="flex flex-col items-center text-center max-w-2xl gpu-accelerated"
                 >
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-100 mb-6 shadow-sm bg-slate-100">
                        {isImageLoading && (
                            <div className="absolute inset-0 bg-slate-200 animate-pulse z-10" />
                        )}
                        <img 
                            src={TestimonialsData[currentTestimonialIndex].image} 
                            alt={TestimonialsData[currentTestimonialIndex].name}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => setIsImageLoading(false)}
                            width="80"
                            height="80"
                        />
                    </div>
                    <p className="text-xl md:text-2xl text-slate-700 font-serif italic mb-8 leading-relaxed">
                        "{TestimonialsData[currentTestimonialIndex].text}"
                    </p>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg">{TestimonialsData[currentTestimonialIndex].name}</h4>
                        <p className="text-yellow-600 font-medium text-sm">{TestimonialsData[currentTestimonialIndex].role}</p>
                    </div>
                 </motion.div>
               </AnimatePresence>
             </div>

             {/* Carousel Controls */}
             <div className="flex justify-center gap-4 mt-8">
                <button 
                    onClick={prevTestimonial}
                    className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    aria-label="Previous Testimonial"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                    {TestimonialsData.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentTestimonialIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                idx === currentTestimonialIndex ? 'bg-yellow-500 w-6' : 'bg-slate-300'
                            }`}
                        />
                    ))}
                </div>
                <button 
                    onClick={nextTestimonial}
                    className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    aria-label="Next Testimonial"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 pb-32 md:pb-12"> {/* Added padding bottom for mobile CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-yellow-500" />
              <span className="text-xl font-bold text-white tracking-tight font-serif">Juris<span className="text-yellow-600">Academy</span></span>
            </div>
            <p className="max-w-sm mb-6">
              Formando a nova geração de juristas preparados para a revolução tecnológica.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-yellow-500 transition-colors p-2 bg-slate-900 rounded-full border border-slate-800 hover:border-yellow-500/50">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-yellow-500 transition-colors p-2 bg-slate-900 rounded-full border border-slate-800 hover:border-yellow-500/50">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('sobre')} className="hover:text-yellow-500 transition-colors">Sobre</button></li>
              <li><button onClick={() => scrollToSection('instrutor')} className="hover:text-yellow-500 transition-colors">Instrutor</button></li>
              <li><button onClick={() => scrollToSection('modulos')} className="hover:text-yellow-500 transition-colors">Conteúdo</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-yellow-500 transition-colors">Matrícula</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Políticas de Privacidade</a></li>
              <li><a href="#" className="hover:text-yellow-500 transition-colors">Suporte</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 text-sm text-center">
          &copy; {new Date().getFullYear()} JurisAcademy. Todos os direitos reservados.
        </div>
      </footer>

      {/* Floating CTA for Mobile (Conversion Booster) */}
      {!hasAccess && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:hidden z-40 flex items-center justify-between shadow-[0_-5px_15px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col">
                  <span className="text-xs text-slate-500 line-through">De R$ 1.997</span>
                  <span className="text-lg font-bold text-slate-900">R$ 997</span>
              </div>
              <button 
                  onClick={() => scrollToSection('pricing')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition-colors animate-pulse"
              >
                  SIM, QUERO VAGA
              </button>
          </div>
      )}

      {/* AI Chat Widget (Static Import) */}
      <ChatWidget />

      {/* Enrollment Modal (Static Import) */}
      <EnrollmentModal 
          isOpen={isEnrollmentOpen} 
          onClose={() => setIsEnrollmentOpen(false)} 
          planName={selectedPlan}
      />

      {/* Login Modal (Static Import) */}
      <LoginModal 
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
      />

      {/* Payment Modal (Static Import) */}
      <PaymentModal 
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          planName={selectedPlan}
          price={selectedPrice}
          onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default App;