import {
    Shield,
    Brain,
    Landmark,
    Rocket,
    Users,
    HeartPulse,
    Palette,
    Cloud,
    Activity,
    type LucideIcon
} from "lucide-react"

export const domainIconMap: Record<string, LucideIcon> = {
    "🛡 Cybersécurité & Défense Numérique": Shield,
    "🤖 Intelligence Artificielle & Sciences des Données": Brain,
    "💰 Finance Numérique & Technologies Blockchain": Landmark,
    "🚀 Stratégie, Innovation & Entrepreneuriat": Rocket,
    "🏛 Gouvernance, Droit & Leadership": Users,
    "🎨 Arts Numériques & Design Créatif": Palette,
    "🧠 Développement Personnel & Performance Cognitive": HeartPulse,
    "🧬 Santé & Biotechnologies Numériques": Activity,
    // Anciens noms (backup temporaire)
    "Cybersécurité & Souveraineté Numérique": Shield,
    "Intelligence Artificielle & Data Science": Brain,
    "Finance, Blockchain & Cryptoéconomie": Landmark,
    "Business & Innovation Technologique": Rocket,
    "Leadership Africain & Gouvernance": Users,
    "Santé, Biotechnologie & Bien-être": Activity,
    "Arts Visuels & Design Numérique": Palette,
    "Transformation Digitale & Cloud Computing": Cloud,
    "Éducation, EdTech & Pédagogie Alternative": Brain,
    "Entrepreneuriat & Stratégie de Croissance": Rocket,
    "Droit des Affaires & Éthique Numérique": Landmark,
    "Développement Personnel & Efficacité": HeartPulse
};
