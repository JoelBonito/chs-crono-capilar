// Hair diagnostic questionnaire data (20 questions, 3 levels)
// All UI text in French (fr-FR), values in ASCII snake_case

export interface QuestionOption {
  valor: string;
  texto: string;
  descricao?: string;
  peso: { H: number; N: number; R: number };
}

export interface Question {
  id: string;
  nivel: DiagnosticLevel;
  obrigatoria: boolean;
  pergunta: string;
  subtitulo?: string;
  tipo: "single_choice" | "multiple_choice";
  min_selecao?: number;
  max_selecao?: number;
  opcoes: QuestionOption[];
}

export type DiagnosticLevel = "basico" | "intermediario" | "avancado";

export interface LevelConfig {
  nome: string;
  descricao: string;
  duracao: string;
  questionIds: string[];
}

export const LEVELS: Record<DiagnosticLevel, LevelConfig> = {
  basico: {
    nome: "Diagnostic Rapide",
    descricao: "5-7 questions essentielles",
    duracao: "2 min",
    questionIds: ["Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07"],
  },
  intermediario: {
    nome: "Diagnostic Complet",
    descricao: "10-15 questions d\u00e9taill\u00e9es",
    duracao: "4 min",
    questionIds: [
      "Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07",
      "Q08", "Q09", "Q10", "Q11", "Q12", "Q13", "Q14", "Q15",
    ],
  },
  avancado: {
    nome: "Diagnostic Professionnel",
    descricao: "15-20 questions professionnelles",
    duracao: "6 min",
    questionIds: [
      "Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07",
      "Q08", "Q09", "Q10", "Q11", "Q12", "Q13", "Q14", "Q15",
      "Q16", "Q17", "Q18", "Q19", "Q20",
    ],
  },
};

// The 6 core questions ALL users see in the adaptive flow, in this specific order
export const CORE_QUESTION_IDS = ["Q01", "Q03", "Q02", "Q06", "Q04", "Q14"] as const;

// Contextual bridge messages shown before conditional questions
// These make the flow feel conversational ("You mentioned X, let's check Y...")
export const CONTEXTUAL_BRIDGES: Record<string, string> = {
  Q09: "Vous mentionnez la casse. V\u00e9rifions l'\u00e9lasticit\u00e9 de vos cheveux\u00a0:",
  Q15: "Avec un traitement chimique, il est important de conna\u00eetre votre historique\u00a0:",
  Q17: "L'utilisation fr\u00e9quente de chaleur peut affecter l'\u00e9paisseur du cheveu\u00a0:",
  Q08: "Votre profil est un peu complexe. V\u00e9rifions la porosit\u00e9\u00a0:",
  Q10: "Parlons de votre routine actuelle\u00a0:",
  Q16: "Vous avez une porosit\u00e9 haute. Faisons un test plus pr\u00e9cis\u00a0:",
};

export const QUESTIONS: Question[] = [
  {
    id: "Q01",
    nivel: "basico",
    obrigatoria: true,
    pergunta: "Quel est votre type de cheveux\u00a0?",
    subtitulo: "Bas\u00e9 sur la classification internationale",
    tipo: "single_choice",
    opcoes: [
      { valor: "straight", texto: "Lisse (1A-1C)", descricao: "Cheveux raides, sans volume", peso: { H: 5, N: 5, R: 0 } },
      { valor: "wavy", texto: "Ondul\u00e9 (2A-2C)", descricao: "Cheveux avec l\u00e9g\u00e8res vagues", peso: { H: 10, N: 10, R: 0 } },
      { valor: "curly", texto: "Boucl\u00e9 (3A-3C)", descricao: "Boucles bien d\u00e9finies", peso: { H: 15, N: 15, R: 5 } },
      { valor: "coily", texto: "Cr\u00e9pu/Afro (4A-4C)", descricao: "Boucles tr\u00e8s serr\u00e9es ou en spirale", peso: { H: 20, N: 20, R: 10 } },
    ],
  },
  {
    id: "Q02",
    nivel: "basico",
    obrigatoria: true,
    pergunta: "Avez-vous fait une coloration, d\u00e9coloration ou lissage chimique\u00a0?",
    tipo: "single_choice",
    opcoes: [
      { valor: "no", texto: "Non, cheveux naturels", peso: { H: 0, N: 0, R: 0 } },
      { valor: "coloring_lt_3_months", texto: "Oui, coloration il y a moins de 3 mois", peso: { H: 20, N: 10, R: 25 } },
      { valor: "coloring_gte_3_months", texto: "Oui, coloration il y a plus de 3 mois", peso: { H: 15, N: 5, R: 15 } },
      { valor: "bleach", texto: "Oui, d\u00e9coloration (m\u00e8ches ou compl\u00e8te)", peso: { H: 25, N: 15, R: 30 } },
      { valor: "chemical_straightening", texto: "Oui, lissage chimique (permanent ou progressif)", peso: { H: 20, N: 10, R: 30 } },
    ],
  },
  {
    id: "Q03",
    nivel: "basico",
    obrigatoria: true,
    pergunta: "Comment d\u00e9cririez-vous vos cheveux actuellement\u00a0?",
    subtitulo: "Vous pouvez choisir plusieurs options",
    tipo: "multiple_choice",
    min_selecao: 1,
    max_selecao: 4,
    opcoes: [
      { valor: "dry", texto: "Secs et ternes", peso: { H: 25, N: 10, R: 0 } },
      { valor: "oily", texto: "Gras (surtout \u00e0 la racine)", peso: { H: -5, N: -10, R: 0 } },
      { valor: "dull", texto: "Sans brillance", peso: { H: 20, N: 5, R: 5 } },
      { valor: "breakage_fragile", texto: "Cassants et fragiles", peso: { H: 10, N: 5, R: 30 } },
      { valor: "frizz", texto: "Avec beaucoup de frisottis", peso: { H: 5, N: 25, R: 0 } },
      { valor: "tangled", texto: "Emm\u00eal\u00e9s facilement", peso: { H: 15, N: 20, R: 0 } },
      { valor: "split_ends", texto: "Pointes fourchues", peso: { H: 10, N: 5, R: 25 } },
      { valor: "healthy", texto: "En bonne sant\u00e9", peso: { H: 10, N: 10, R: 0 } },
    ],
  },
  {
    id: "Q04",
    nivel: "basico",
    obrigatoria: true,
    pergunta: "\u00c0 quelle fr\u00e9quence lavez-vous vos cheveux\u00a0?",
    tipo: "single_choice",
    opcoes: [
      { valor: "1x", texto: "1 fois par semaine", peso: { H: 0, N: 0, R: 0 } },
      { valor: "2x", texto: "2 fois par semaine", peso: { H: 0, N: 0, R: 0 } },
      { valor: "3x", texto: "3 fois par semaine", peso: { H: 0, N: 0, R: 0 } },
      { valor: "more_than_3x_week", texto: "Plus de 3 fois par semaine", peso: { H: 5, N: -5, R: 0 } },
    ],
  },
  {
    id: "Q05",
    nivel: "basico",
    obrigatoria: true,
    pergunta: "Quelle est la longueur de vos cheveux\u00a0?",
    tipo: "single_choice",
    opcoes: [
      { valor: "short", texto: "Courts (au-dessus des \u00e9paules)", peso: { H: 0, N: 0, R: 0 } },
      { valor: "medium", texto: "Mi-longs (jusqu'aux \u00e9paules)", peso: { H: 0, N: 0, R: 0 } },
      { valor: "long", texto: "Longs (en dessous des \u00e9paules)", peso: { H: 5, N: 5, R: 5 } },
      { valor: "very_long", texto: "Tr\u00e8s longs (en dessous de la poitrine)", peso: { H: 10, N: 10, R: 10 } },
    ],
  },
  {
    id: "Q06",
    nivel: "basico",
    obrigatoria: true,
    pergunta: "Utilisez-vous fr\u00e9quemment des outils chauffants\u00a0?",
    subtitulo: "S\u00e8che-cheveux, lisseur, fer \u00e0 boucler",
    tipo: "single_choice",
    opcoes: [
      { valor: "never", texto: "Jamais ou rarement", peso: { H: 0, N: 0, R: 0 } },
      { valor: "occasional", texto: "1-2 fois par semaine", peso: { H: 10, N: 5, R: 15 } },
      { valor: "frequent", texto: "3-4 fois par semaine", peso: { H: 15, N: 10, R: 20 } },
      { valor: "daily", texto: "Tous les jours", peso: { H: 20, N: 15, R: 30 } },
    ],
  },
  {
    id: "Q07",
    nivel: "basico",
    obrigatoria: false,
    pergunta: "\u00cates-vous souvent expos\u00e9(e) au soleil, \u00e0 la mer ou au chlore\u00a0?",
    tipo: "single_choice",
    opcoes: [
      { valor: "no", texto: "Non, rarement", peso: { H: 0, N: 0, R: 0 } },
      { valor: "sun_occasional", texto: "Oui, soleil occasionnel", peso: { H: 10, N: 5, R: 5 } },
      { valor: "pool_frequent", texto: "Oui, piscine chlor\u00e9e fr\u00e9quemment", peso: { H: 20, N: 10, R: 15 } },
      { valor: "beach_frequent", texto: "Oui, mer et soleil fr\u00e9quemment", peso: { H: 25, N: 15, R: 20 } },
    ],
  },
  {
    id: "Q08",
    nivel: "intermediario",
    obrigatoria: true,
    pergunta: "Comment vos cheveux r\u00e9agissent-ils \u00e0 l'eau\u00a0?",
    subtitulo: "Test de porosit\u00e9 simple",
    tipo: "single_choice",
    opcoes: [
      { valor: "repels", texto: "L'eau glisse, difficile \u00e0 mouiller", descricao: "Porosit\u00e9 faible - cuticule ferm\u00e9e", peso: { H: 15, N: 25, R: 0 } },
      { valor: "absorbs_normal", texto: "S'humidifient normalement", descricao: "Porosit\u00e9 moyenne - cuticule l\u00e9g\u00e8rement ouverte", peso: { H: 10, N: 10, R: 0 } },
      { valor: "absorbs_fast", texto: "Absorbent l'eau rapidement, s\u00e8chent vite", descricao: "Porosit\u00e9 haute - cuticule tr\u00e8s ouverte", peso: { H: 20, N: 30, R: 10 } },
    ],
  },
  {
    id: "Q09",
    nivel: "intermediario",
    obrigatoria: true,
    pergunta: "Si vous \u00e9tirez une m\u00e8che mouill\u00e9e, que se passe-t-il\u00a0?",
    subtitulo: "Test d'\u00e9lasticit\u00e9",
    tipo: "single_choice",
    opcoes: [
      { valor: "stretches_returns", texto: "Elle s'\u00e9tire et reprend sa forme", descricao: "Bonne \u00e9lasticit\u00e9", peso: { H: 5, N: 5, R: 0 } },
      { valor: "stretches_little", texto: "Elle s'\u00e9tire peu, assez rigide", descricao: "Manque d'hydratation", peso: { H: 20, N: 10, R: 5 } },
      { valor: "breaks", texto: "Elle se casse facilement", descricao: "Manque de prot\u00e9ines", peso: { H: 10, N: 5, R: 30 } },
    ],
  },
  {
    id: "Q10",
    nivel: "intermediario",
    obrigatoria: true,
    pergunta: "Quelle est votre routine capillaire actuelle\u00a0?",
    tipo: "single_choice",
    opcoes: [
      { valor: "basic", texto: "Shampooing uniquement", peso: { H: 20, N: 15, R: 10 } },
      { valor: "conditioner_only", texto: "Shampooing + apr\u00e8s-shampooing", peso: { H: 10, N: 10, R: 0 } },
      { valor: "mask_occasional", texto: "Shampooing + masque occasionnel", peso: { H: 5, N: 5, R: 0 } },
      { valor: "complete", texto: "Routine compl\u00e8te (shampooing, masque, leave-in)", peso: { H: 0, N: 0, R: 0 } },
    ],
  },
  {
    id: "Q11",
    nivel: "intermediario",
    obrigatoria: false,
    pergunta: "Comment d\u00e9cririez-vous le volume de vos cheveux\u00a0?",
    tipo: "single_choice",
    opcoes: [
      { valor: "fine_low_density", texto: "Fins et clairsem\u00e9s", peso: { H: 10, N: 10, R: 15 } },
      { valor: "medium", texto: "\u00c9paisseur moyenne", peso: { H: 5, N: 5, R: 5 } },
      { valor: "thick_high_density", texto: "\u00c9pais et denses", peso: { H: 0, N: 5, R: 0 } },
    ],
  },
  {
    id: "Q12",
    nivel: "intermediario",
    obrigatoria: false,
    pergunta: "Combien de temps vos cheveux mettent-ils \u00e0 s\u00e9cher naturellement\u00a0?",
    tipo: "single_choice",
    opcoes: [
      { valor: "fast", texto: "Moins de 1 heure (s\u00e8chent tr\u00e8s vite)", descricao: "Porosit\u00e9 haute ou cheveux tr\u00e8s fins", peso: { H: 15, N: 20, R: 5 } },
      { valor: "normal", texto: "1-3 heures", peso: { H: 5, N: 5, R: 0 } },
      { valor: "slow", texto: "Plus de 3 heures (restent humides longtemps)", descricao: "Porosit\u00e9 faible ou cheveux tr\u00e8s \u00e9pais", peso: { H: 10, N: 25, R: 0 } },
    ],
  },
  {
    id: "Q13",
    nivel: "intermediario",
    obrigatoria: false,
    pergunta: "Comment vos cheveux r\u00e9agissent-ils aux produits riches (huiles, masques)\u00a0?",
    tipo: "single_choice",
    opcoes: [
      { valor: "absorbs_well", texto: "Absorbent bien, restent doux", peso: { H: 5, N: 5, R: 0 } },
      { valor: "gets_weighed_down", texto: "Deviennent lourds et gras", descricao: "Porosit\u00e9 faible, produits s'accumulent", peso: { H: 15, N: -5, R: 0 } },
      { valor: "no_effect", texto: "Peu d'effet visible", descricao: "Porosit\u00e9 haute, produits p\u00e9n\u00e8trent pas assez", peso: { H: 10, N: 25, R: 10 } },
    ],
  },
  {
    id: "Q14",
    nivel: "intermediario",
    obrigatoria: true,
    pergunta: "Quel est votre objectif principal\u00a0?",
    tipo: "single_choice",
    opcoes: [
      { valor: "shine", texto: "Avoir plus de brillance", peso: { H: 20, N: 10, R: 0 } },
      { valor: "frizz_control", texto: "Contr\u00f4ler les frisottis", peso: { H: 5, N: 25, R: 0 } },
      { valor: "less_breakage", texto: "R\u00e9duire la casse", peso: { H: 10, N: 5, R: 30 } },
      { valor: "growth", texto: "Favoriser la pousse", peso: { H: 10, N: 10, R: 20 } },
      { valor: "curl_definition", texto: "D\u00e9finir les boucles", peso: { H: 15, N: 20, R: 5 } },
      { valor: "maintenance", texto: "Maintenir en bonne sant\u00e9", peso: { H: 10, N: 10, R: 5 } },
    ],
  },
  {
    id: "Q15",
    nivel: "intermediario",
    obrigatoria: false,
    pergunta: "Avez-vous d\u00e9j\u00e0 fait un traitement capillaire professionnel\u00a0?",
    subtitulo: "K\u00e9ratine, botox capillaire, caut\u00e9risation...",
    tipo: "single_choice",
    opcoes: [
      { valor: "no", texto: "Non, jamais", peso: { H: 0, N: 0, R: 0 } },
      { valor: "keratin_recent", texto: "Oui, k\u00e9ratine il y a moins de 6 mois", peso: { H: 15, N: 10, R: 5 } },
      { valor: "botox_recent", texto: "Oui, botox capillaire r\u00e9cemment", peso: { H: 10, N: 5, R: 0 } },
      { valor: "other_old", texto: "Oui, mais il y a plus de 6 mois", peso: { H: 5, N: 5, R: 5 } },
    ],
  },
  {
    id: "Q16",
    nivel: "avancado",
    obrigatoria: true,
    pergunta: "Test du verre d'eau\u00a0: Placez une m\u00e8che dans un verre. Que se passe-t-il\u00a0?",
    subtitulo: "Test de porosit\u00e9 professionnel",
    tipo: "single_choice",
    opcoes: [
      { valor: "floats", texto: "Elle flotte \u00e0 la surface", descricao: "Porosit\u00e9 tr\u00e8s faible", peso: { H: 20, N: 30, R: 0 } },
      { valor: "middle", texto: "Elle reste au milieu", descricao: "Porosit\u00e9 moyenne", peso: { H: 10, N: 10, R: 0 } },
      { valor: "sinks", texto: "Elle coule au fond rapidement", descricao: "Porosit\u00e9 tr\u00e8s haute", peso: { H: 15, N: 35, R: 15 } },
    ],
  },
  {
    id: "Q17",
    nivel: "avancado",
    obrigatoria: true,
    pergunta: "Quelle est l'\u00e9paisseur de vos cheveux individuels\u00a0?",
    subtitulo: "Comparez avec un fil \u00e0 coudre",
    tipo: "single_choice",
    opcoes: [
      { valor: "fine", texto: "Plus fin qu'un fil (difficile \u00e0 sentir)", peso: { H: 10, N: 10, R: 10 } },
      { valor: "medium", texto: "Similaire \u00e0 un fil", peso: { H: 5, N: 5, R: 5 } },
      { valor: "thick", texto: "Plus \u00e9pais qu'un fil", peso: { H: 0, N: 0, R: 0 } },
    ],
  },
  {
    id: "Q18",
    nivel: "avancado",
    obrigatoria: false,
    pergunta: "Quelle est la densit\u00e9 de vos cheveux\u00a0?",
    subtitulo: "Faites une queue de cheval et mesurez la circonf\u00e9rence",
    tipo: "single_choice",
    opcoes: [
      { valor: "low", texto: "Faible (moins de 5 cm de circonf\u00e9rence)", peso: { H: 10, N: 10, R: 15 } },
      { valor: "medium", texto: "Moyenne (5-10 cm)", peso: { H: 5, N: 5, R: 5 } },
      { valor: "high", texto: "Haute (plus de 10 cm)", peso: { H: 0, N: 5, R: 0 } },
    ],
  },
  {
    id: "Q19",
    nivel: "avancado",
    obrigatoria: false,
    pergunta: "Votre cuir chevelu est-il sensible\u00a0?",
    tipo: "single_choice",
    opcoes: [
      { valor: "no", texto: "Non, aucune sensibilit\u00e9", peso: { H: 0, N: 0, R: 0 } },
      { valor: "oily", texto: "Oui, gras et avec pellicules", peso: { H: 0, N: -10, R: 0 } },
      { valor: "dry", texto: "Oui, sec et qui d\u00e9mange", peso: { H: 15, N: 10, R: 0 } },
      { valor: "sensitive", texto: "Oui, irrit\u00e9 facilement", peso: { H: 10, N: 5, R: 0 } },
    ],
  },
  {
    id: "Q20",
    nivel: "avancado",
    obrigatoria: false,
    pergunta: "Vos cheveux changent-ils selon les saisons\u00a0?",
    tipo: "multiple_choice",
    opcoes: [
      { valor: "summer_dry", texto: "Plus secs en \u00e9t\u00e9", peso: { H: 15, N: 5, R: 5 } },
      { valor: "winter_static", texto: "Plus \u00e9lectriques en hiver", peso: { H: 10, N: 15, R: 0 } },
      { valor: "humidity_frizz", texto: "Plus de frisottis par temps humide", peso: { H: 5, N: 20, R: 0 } },
      { valor: "no_change", texto: "Non, restent constants", peso: { H: 0, N: 0, R: 0 } },
    ],
  },
];
