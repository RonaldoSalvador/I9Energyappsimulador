import { LucideIcon, CheckCircle2, DollarSign, LayoutDashboard, Ban } from 'lucide-react';

export interface BadgeConfig {
    text: string;
    iconName: 'CheckCircle2' | 'DollarSign' | 'LayoutDashboard' | 'Ban';
}

export interface OfferConfig {
    titlePrefix: string;
    highlight: string;
    titleSuffix: string;
    descriptionPrefix?: string; // Optional prefix for description
    description: string;
    descriptionHighlight?: string; // Optional bold part
    buttonText: string;
    badges: BadgeConfig[];
}

export const BUSINESS_CONFIG = {
    clientOffer: {
        titlePrefix: "Seu Ano Novo com",
        highlight: "50% OFF",
        titleSuffix: "na conta de luz",
        descriptionPrefix: "Garanta",
        description: "nos primeiros 3 meses e economia garantida o ano todo. Sem obras e 100% digital.",
        descriptionHighlight: "50% de desconto",
        buttonText: "Simular Economia",
        badges: [
            { text: "Sem fidelidade", iconName: "CheckCircle2" },
            { text: "Sem obras", iconName: "CheckCircle2" },
            { text: "100% Digital", iconName: "CheckCircle2" }
        ] as BadgeConfig[]
    },
    partnerOffer: {
        titlePrefix: "Indique clientes e",
        highlight: "Ganhe Bônus",
        titleSuffix: "por indicação",
        descriptionPrefix: "Transforme sua rede de contatos em renda extra.",
        description: "Cada cliente que fechar contrato, você ganha um bônus.",
        descriptionHighlight: "Ganhe por Indicação",
        buttonText: "Quero ser Parceiro",
        badges: [
            { text: "Bônus por Cliente", iconName: "DollarSign" },
            { text: "Painel Exclusivo", iconName: "LayoutDashboard" },
            { text: "Zero Investimento", iconName: "Ban" }
        ] as BadgeConfig[]
    }
};
