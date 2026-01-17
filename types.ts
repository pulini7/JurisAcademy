export interface Module {
    title: string;
    lessons: string[];
}

export interface PricingPlan {
    name: string;
    price: string;
    features: string[];
    highlight?: boolean;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
}

export interface Testimonial {
    id: number;
    name: string;
    role: string;
    image: string;
    text: string;
}