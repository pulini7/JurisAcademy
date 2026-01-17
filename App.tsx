import React, { useState } from 'react';
import { Menu, X, Gavel, Brain, Shield, Rocket, CheckCircle, ChevronDown, MessageSquare, Quote, ChevronLeft, ChevronRight, Linkedin, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatWidget } from './components/ChatWidget';
import { CourseModules, FAQData, PricingPlans, TestimonialsData } from './constants';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number | null>(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const toggleModule = (index: number) => {
    setOpenModuleIndex(openModuleIndex === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % TestimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + TestimonialsData.length) % TestimonialsData.length);
  };

  // Variantes de animação para reutilização
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-slate-900 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-yellow-500" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Juris<span className="text-yellow-600">Academy</span></span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('sobre')} className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Sobre o Curso</button>
              <button onClick={() => scrollToSection('modulos')} className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Conteúdo</button>
              <button onClick={() => scrollToSection('faq')} className="text-slate-600 hover:text-slate-900 font-medium transition-colors">FAQ</button>
              <button onClick={() => scrollToSection('pricing')} className="bg-slate-900 text-white px-5 py-2 rounded-full font-medium hover:bg-slate-800 transition-colors">Inscreva-se</button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-900">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => scrollToSection('sobre')} className="block w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 font-medium">Sobre o Curso</button>
              <button onClick={() => scrollToSection('modulos')} className="block w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 font-medium">Conteúdo</button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 font-medium">FAQ</button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-3 py-2 text-yellow-600 font-bold hover:bg-slate-50">Inscreva-se Agora</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-900/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 text-center md:text-left space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold"
            >
              <Rocket className="h-4 w-4" />
              <span>Turmas Abertas 2026</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Revolucione sua Advocacia com <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Inteligência Artificial</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl">
              Domine as ferramentas que estão transformando o mercado jurídico. Automatize peças, analise jurisprudência em segundos e multiplique sua produtividade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={() => scrollToSection('pricing')} className="px-8 py-4 bg-yellow-500 text-slate-900 rounded-lg font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20">
                Garantir minha vaga
              </button>
              <button onClick={() => scrollToSection('modulos')} className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Ver Grade Curricular
              </button>
            </div>
          </motion.div>
          <motion.div 
            className="md:w-1/2 mt-12 md:mt-0 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
             <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 mx-auto max-w-md md:max-w-full">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
                  alt="Advogado em escritório moderno com dashboards de IA" 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                    <p className="text-white font-serif text-2xl italic">"O futuro do direito não é sobre substituir advogados, mas sobre advogados que usam IA substituindo os que não usam."</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits / Statistics */}
      <section className="py-12 bg-white -mt-10 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {[
            { icon: Gavel, title: "Metodologia Prática", desc: "Aprenda aplicando em casos reais do seu escritório." },
            { icon: Brain, title: "Tecnologia de Ponta", desc: "Domine ChatGPT, Gemini, NotebookLM e outras ferramentas essenciais para a prática jurídica." },
            { icon: Shield, title: "Ética e Segurança", desc: "Compliance e proteção de dados no uso da IA." }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeInUp}
              className="bg-white p-8 rounded-xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:shadow-2xl transition-shadow"
            >
              <div className="bg-yellow-50 p-4 rounded-full mb-6 border border-yellow-100">
                <item.icon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Curriculum Section */}
      <section id="modulos" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">O que você vai aprender</h2>
            <p className="text-slate-600 text-lg">Um programa completo, do básico ao avançado, desenhado para juristas.</p>
          </motion.div>

          <div className="space-y-4">
            {CourseModules.map((module, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <button
                  onClick={() => toggleModule(index)}
                  className="w-full px-6 py-5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${openModuleIndex === index ? 'rotate-180' : ''}`} />
                </button>
                {openModuleIndex === index && (
                  <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100">
                    <ul className="space-y-3">
                      {module.lessons.map((lesson, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-600">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?blur')] opacity-5 bg-cover bg-fixed"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Investimento</h2>
            <p className="text-slate-300 text-lg">Escolha o plano ideal para o seu momento profissional.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PricingPlans.map((plan, index) => (
              <motion.div 
                key={index} 
                className={`rounded-2xl p-8 relative ${plan.highlight ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-yellow-500 shadow-2xl shadow-yellow-500/10' : 'bg-slate-800 border border-slate-700'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-sm text-slate-400 mb-2">R$</span>
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-slate-400 mb-2">/único</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className={`h-5 w-5 ${plan.highlight ? 'text-yellow-500' : 'text-slate-400'}`} />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-lg font-bold transition-transform ${plan.highlight ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                  Começar Agora
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.h2 
             className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeInUp}
           >
             Perguntas Frequentes
           </motion.h2>
           <div className="space-y-6">
              {FAQData.map((faq, index) => (
                  <motion.div 
                    key={index} 
                    className="border-b border-slate-200 pb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h4>
                      <p className="text-slate-600">{faq.answer}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Quem já revolucionou a advocacia</h2>
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
                   transition={{ duration: 0.4 }}
                   className="flex flex-col items-center text-center max-w-2xl"
                 >
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-100 mb-6 shadow-sm">
                        <img 
                            src={TestimonialsData[currentTestimonialIndex].image} 
                            alt={TestimonialsData[currentTestimonialIndex].name}
                            className="w-full h-full object-cover"
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
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-yellow-500" />
              <span className="text-xl font-bold text-white tracking-tight">Juris<span className="text-yellow-600">Academy</span></span>
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
              <li><button onClick={() => scrollToSection('modulos')} className="hover:text-yellow-500 transition-colors">Conteúdo</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-yellow-500 transition-colors">Matrícula</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-2">
              <li>suporte@jurisacademy.com.br</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 text-sm text-center">
          &copy; {new Date().getFullYear()} JurisAcademy. Todos os direitos reservados.
        </div>
      </footer>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;