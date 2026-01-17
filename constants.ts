import { Module, PricingPlan, FAQItem, Testimonial, Instructor } from './types';

export const CourseModules: Module[] = [
    {
        title: "Introdução à Inteligência Artificial no Direito",
        lessons: [
            "Conceitos fundamentais de IA e Machine Learning",
            "Histórico da evolução tecnológica no cenário jurídico",
            "Diferença entre IA Simbólica e IA Generativa"
        ]
    },
    {
        title: "Análise Preditiva Aplicada ao Direito",
        lessons: [
            "O que é Jurimetria e como aplicá-la na prática",
            "Ferramentas de predição de resultados judiciais",
            "Análise de dados para definição de estratégia processual"
        ]
    },
    {
        title: "Inovação e Desafios no Mundo Jurídico",
        lessons: [
            "Transformação digital em escritórios e tribunais",
            "Barreiras culturais e tecnológicas na advocacia",
            "O papel do advogado contemporâneo na era digital"
        ]
    },
    {
        title: "Direito da IA, Ética e Proteção de Dados",
        lessons: [
            "Vieses algorítmicos e discriminação em decisões automatizadas",
            "Privacidade, input de dados e conformidade com a LGPD",
            "Responsabilidade civil por atos praticados por IA"
        ]
    },
    {
        title: "Governança Internacional da Inteligência Artificial",
        lessons: [
            "O EU AI Act e seus impactos globais",
            "Diretrizes da OCDE e UNESCO sobre IA",
            "Comparativo de legislações: EUA, China e Europa"
        ]
    },
    {
        title: "Material Educacional",
        lessons: [
            "Acesso à biblioteca digital do curso",
            "Guias de referência rápida e checklists",
            "Curadoria de artigos e jurisprudência comentada"
        ]
    },
    {
        title: "Regulamentação da IA no Brasil: Panorama Atual",
        lessons: [
            "Análise detalhada do PL 2338/23",
            "A aplicação do Marco Civil da Internet à IA",
            "Perspectivas legislativas e regulatórias nacionais"
        ]
    },
    {
        title: "Inteligência Artificial Generativa: Introdução Prática",
        lessons: [
            "Como funcionam as LLMs (Large Language Models)",
            "Visão geral das plataformas: Gemini, GPT-4, Claude",
            "Configuração inicial do ambiente de trabalho seguro"
        ]
    },
    {
        title: "Uso da IA Generativa na Criação de Documentos",
        lessons: [
            "Redação assistida de contratos e cláusulas complexas",
            "Estruturação de petições iniciais e contestações",
            "Técnicas de revisão gramatical e legal automatizada"
        ]
    },
    {
        title: "Ética e Riscos Jurídicos da IA Generativa",
        lessons: [
            "Alucinações da IA: Como identificar, mitigar e corrigir",
            "Sigilo profissional e o risco de vazamento de dados",
            "Questões de Direitos Autorais sobre obras geradas por IA"
        ]
    },
    {
        title: "Educação Jurídica",
        lessons: [
            "Upskilling e Reskilling: O novo perfil do advogado",
            "Pensamento computacional aplicado ao Direito",
            "Como estudar e se manter atualizado tecnologicamente"
        ]
    },
    {
        title: "Técnicas Avançadas de Engenharia de Prompts",
        lessons: [
            "Estruturas de prompts: Contexto, Instrução, Formato",
            "Chain-of-Thought e Few-Shot Prompting para casos complexos",
            "Refinamento iterativo de respostas para maior precisão"
        ]
    },
    {
        title: "Biblioteca Prática de Prompts Jurídicos",
        lessons: [
            "Repositório de prompts para Cível, Trabalhista e Penal",
            "Templates prontos para consultoria e pareceres",
            "Adaptação de prompts para diferentes modelos de IA"
        ]
    },
    {
        title: "Automação Jurídica, Decisão e Visual Law",
        lessons: [
            "Automação de fluxos de trabalho repetitivos",
            "Uso de IA para suporte à decisão judicial",
            "Integração de IA com técnicas de Visual Law e Legal Design"
        ]
    },
    {
        title: "O Futuro da Advocacia na Era da IA",
        lessons: [
            "Novos modelos de negócios jurídicos",
            "Tendências tecnológicas para os próximos 5 anos",
            "Como se manter relevante e competitivo no mercado"
        ]
    }
];

export const PricingPlans: PricingPlan[] = [
    {
        name: "Essencial",
        originalPrice: "997",
        price: "497",
        features: [
            "Acesso completo aos 15 módulos",
            "Certificado de Conclusão (40h)",
            "Acesso por 1 ano",
            "Material de apoio em PDF"
        ]
    },
    {
        name: "Pro + Mentoria",
        originalPrice: "1.997",
        price: "997",
        highlight: true,
        features: [
            "Tudo do plano Essencial",
            "4 Encontros de Mentoria ao Vivo",
            "Biblioteca de Prompts Prontos (+500)",
            "Acesso vitalício ao curso",
            "Grupo exclusivo de Networking"
        ]
    }
];

export const FAQData: FAQItem[] = [
    {
        question: "Preciso saber programar?",
        answer: "Não! O curso é focado em advogados e estudantes de direito. Ensinamos a usar as ferramentas com linguagem natural, sem necessidade de código."
    },
    {
        question: "O curso aborda quais IAs?",
        answer: "Focamos principalmente no Google Gemini 1.5 Pro e GPT-4, que são os líderes de mercado atuais e possuem melhor capacidade de raciocínio lógico-jurídico."
    },
    {
        question: "Tem certificado?",
        answer: "Sim, ao concluir todas as aulas você recebe um certificado digital de 40h válido como atividade complementar."
    },
    {
        question: "E se eu não gostar?",
        answer: "Garantia incondicional de 7 dias. Se não for o que esperava, devolvemos 100% do seu investimento sem burocracia."
    }
];

export const TestimonialsData: Testimonial[] = [
    {
        id: 1,
        name: "Dra. Ana Paula Torres",
        role: "Advogada Civilista",
        image: "https://picsum.photos/id/64/200/200",
        text: "Eu gastava horas revisando contratos. Com as técnicas de prompt engineering do curso, reduzi esse tempo em 70%. O módulo de ética me deu a segurança que eu precisava para implementar a IA no escritório."
    },
    {
        id: 2,
        name: "Dr. Carlos Mendes",
        role: "Sócio de Direito Empresarial",
        image: "https://picsum.photos/id/91/200/200",
        text: "A JurisAcademy não ensina apenas a 'conversar com o robô', ensina a pensar juridicamente com a máquina. A automação de jurisprudência mudou o nível das nossas petições iniciais."
    },
    {
        id: 3,
        name: "Mariana Costa",
        role: "Estudante de Direito",
        image: "https://picsum.photos/id/338/200/200",
        text: "Estava com medo do futuro da profissão, mas o curso me mostrou como a tecnologia é uma aliada. Consegui um estágio incrível justamente por saber manusear LLMs para pesquisa jurídica."
    }
];

export const InstructorData: Instructor = {
    name: "Dr. Vitor Pastori Pulini",
    role: "OAB/SP 460.464 | Especialista em Direito Digital",
    // Imagem de placeholder neutro para substituição futura
    image: "https://placehold.co/600x800/f1f5f9/94a3b8?text=Foto+do+Instrutor",
    bio: "Advogado inscrito na OAB/SP sob o nº 460.464, Especialista em Direito Digital e Proteção de Dados. Pioneiro na aplicação prática de Inteligência Artificial na advocacia, ajudando escritórios a modernizarem seus processos com segurança e eficiência, sempre respeitando a ética e o sigilo profissional.",
    achievements: [
        "OAB/SP 460.464",
        "Especialista em Proteção de Dados",
        "Consultor de Inovação Jurídica",
        "Advogado Digital"
    ]
};