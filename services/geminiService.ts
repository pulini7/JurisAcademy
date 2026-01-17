import { GoogleGenAI, Chat } from "@google/genai";
import { CourseModules, PricingPlans, FAQData, InstructorData } from "../constants";

let chatSession: Chat | null = null;

// Initialize the API client
// NOTE: In a real production app, ensure API_KEY is set in your environment variables.
// For this demo, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const getSystemInstruction = () => {
    const modulesText = CourseModules.map(m => `- ${m.title}: ${m.lessons.join(', ')}`).join('\n');
    const pricingText = PricingPlans.map(p => `- Plano ${p.name}: R$${p.price}. Benefícios: ${p.features.join(', ')}`).join('\n');
    const faqText = FAQData.map(f => `Q: ${f.question} A: ${f.answer}`).join('\n');

    return `
    Você é a "JurisAI", assistente virtual oficial da JurisAcademy.
    Seu objetivo é ajudar advogados e estudantes interessados no curso de Direito e Inteligência Artificial.
    
    ESTILO: Profissional, educado, persuasivo mas ético. Use emojis moderadamente ⚖️ 🤖.
    
    O PROFESSOR:
    O curso é ministrado pelo ${InstructorData.name}, ${InstructorData.role}. Ele é ${InstructorData.bio}.
    Destaque que ele une a visão jurídica com a técnica tecnológica.
    
    INFORMAÇÕES DO CURSO:
    
    MÓDULOS:
    ${modulesText}
    
    PREÇOS:
    ${pricingText}
    
    DÚVIDAS COMUNS:
    ${faqText}
    
    REGRAS:
    1. Responda apenas sobre o curso, direito e IA.
    2. Se perguntarem o preço, apresente o plano "Pro + Mentoria" como a melhor opção.
    3. Seja conciso. Respostas curtas são melhores para chat.
    4. Ao final de tirar uma dúvida, convide para a matrícula.
    5. Se não souber a resposta, peça para enviarem e-mail para suporte@jurisacademy.com.br.
    `;
};

export const getChatSession = (): Chat => {
    if (!chatSession) {
        chatSession = ai.chats.create({
            model: 'gemini-3-flash-preview', // Using the fast model for chat interaction
            config: {
                systemInstruction: getSystemInstruction(),
                temperature: 0.7,
            },
        });
    }
    return chatSession;
};

export const sendMessageStream = async (message: string) => {
    const chat = getChatSession();
    return await chat.sendMessageStream({ message });
};