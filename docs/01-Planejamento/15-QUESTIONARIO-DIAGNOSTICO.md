# Questionário de Diagnóstico Capilar

## CronoCapilar - Sistema de Perguntas e Pontuação

**Versão:** 1.0
**Data:** 05 de Fevereiro de 2026
**Idioma:** Francês (FR)
**Baseado em:** Conhecimento tricológico e cronograma capilar

---

# 📑 Índice

1. [Visão Geral](#1-visão-geral)
2. [Nível Básico (5-7 perguntas)](#2-nível-básico-5-7-perguntas)
3. [Nível Intermediário (10-15 perguntas)](#3-nível-intermediário-10-15-perguntas)
4. [Nível Avançado (15-20 perguntas)](#4-nível-avançado-15-20-perguntas)
5. [Lógica Condicional](#5-lógica-condicional)
6. [Sistema de Pontuação](#6-sistema-de-pontuação)
7. [Algoritmo de Cálculo](#7-algoritmo-de-cálculo)
8. [Implementação JSON](#8-implementação-json)

---

# 1. Visão Geral

## 1.1 Princípios do Diagnóstico

O questionário identifica as necessidades capilares através de 3 eixos:

| Eixo | Sigla | O que detecta |
|------|-------|---------------|
| **Hidratação** | H | Ressecamento, falta de água, opacidade |
| **Nutrição** | N | Falta de lipídios, frizz, porosidade alta |
| **Reconstrução** | R | Danos estruturais, quebra, elasticidade perdida |

## 1.2 Sistema de Pesos

Cada opção de resposta tem pesos para H, N e R:

```typescript
{
  valor: "dry",
  texto: "Secs et ternes",
  peso: {
    H: 25,  // Alto impacto em Hidratação
    N: 10,  // Médio impacto em Nutrição
    R: 0    // Sem impacto em Reconstrução
  }
}
```

**Pesos podem ser:**
- **Positivos** (0 a 30): Indica necessidade
- **Negativos** (-10 a 0): Reduz necessidade
- **Zero** (0): Neutro

## 1.3 Convenção Técnica de IDs e Valores (Obrigatória)

Para evitar bugs de serialização e regras condicionais inconsistentes:

- `id` de pergunta: manter formato `Q01...Q20`
- `valor` de opção: **sempre ASCII técnico em inglês** (`snake_case`)
- `texto` / `descricao`: ficam em francês para UI

Exemplos válidos:

- `no`, `breakage_fragile`, `healthy`
- `more_than_3x_week`, `chemical_straightening`, `hair_loss`

Exemplos inválidos para payload:

- `nao`, `quebradiço`, `saudavel`
- termos com acentos ou mistura PT/FR no campo `valor`

## 1.4 Papel da IA de Fotos (Gemini)

- O **questionário** continua sendo a base do diagnóstico.
- A IA (Gemini) é usada para **analisar fotos opcionais** e gerar sinais visuais.
- Os sinais das fotos são incorporados ao diagnóstico final como camada de enriquecimento.
- Sem fotos, o diagnóstico é calculado apenas com o questionário.

---

# 2. Nível Básico (5-7 perguntas)

## Q01 - Tipo de Cabelo (Curvatura)

```json
{
  "id": "Q01",
  "nivel": "basico",
  "obrigatoria": true,
  "pergunta": "Quel est votre type de cheveux?",
  "subtitulo": "Basé sur la classification internationale",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "straight",
      "texto": "Lisse (1A-1C)",
      "descricao": "Cheveux raides, sans volume",
      "peso": { "H": 5, "N": 5, "R": 0 }
    },
    {
      "valor": "wavy",
      "texto": "Ondulé (2A-2C)",
      "descricao": "Cheveux avec légères vagues",
      "peso": { "H": 10, "N": 10, "R": 0 }
    },
    {
      "valor": "curly",
      "texto": "Bouclé (3A-3C)",
      "descricao": "Boucles bien définies",
      "peso": { "H": 15, "N": 15, "R": 5 }
    },
    {
      "valor": "coily",
      "texto": "Crépu/Afro (4A-4C)",
      "descricao": "Boucles très serrées ou en spirale",
      "peso": { "H": 20, "N": 20, "R": 10 }
    }
  ]
}
```

**Justificativa dos pesos:**
- Cabelos crespos têm mais necessidade de hidratação e nutrição por natureza (cutícula mais aberta)
- Cabelos lisos tendem a ser mais oleosos = menor necessidade

---

## Q02 - Química/Coloração

```json
{
  "id": "Q02",
  "nivel": "basico",
  "obrigatoria": true,
  "pergunta": "Avez-vous fait une coloration, décoloration ou lissage chimique?",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "no",
      "texto": "Non, cheveux naturels",
      "peso": { "H": 0, "N": 0, "R": 0 }
    },
    {
      "valor": "coloring_lt_3_months",
      "texto": "Oui, coloration il y a moins de 3 mois",
      "peso": { "H": 20, "N": 10, "R": 25 }
    },
    {
      "valor": "coloring_gte_3_months",
      "texto": "Oui, coloration il y a plus de 3 mois",
      "peso": { "H": 15, "N": 5, "R": 15 }
    },
    {
      "valor": "bleach",
      "texto": "Oui, décoloration (mèches ou complète)",
      "peso": { "H": 25, "N": 15, "R": 30 }
    },
    {
      "valor": "chemical_straightening",
      "texto": "Oui, lissage chimique (permanent ou progressif)",
      "peso": { "H": 20, "N": 10, "R": 30 }
    }
  ]
}
```

**Justificativa:**
- Descoloração = maior dano estrutural (R alto)
- Alisamento = quebra pontes de queratina (R muito alto)
- Coloração = resseca e danifica moderadamente

---

## Q03 - Estado Atual do Cabelo

```json
{
  "id": "Q03",
  "nivel": "basico",
  "obrigatoria": true,
  "pergunta": "Comment décririez-vous vos cheveux actuellement?",
  "subtitulo": "Vous pouvez choisir plusieurs options",
  "tipo": "multiple_choice",
  "min_selecao": 1,
  "max_selecao": 4,
  "opcoes": [
    {
      "valor": "dry",
      "texto": "Secs et ternes",
      "peso": { "H": 25, "N": 10, "R": 0 }
    },
    {
      "valor": "oily",
      "texto": "Gras (surtout à la racine)",
      "peso": { "H": -5, "N": -10, "R": 0 }
    },
    {
      "valor": "dull",
      "texto": "Sans brillance",
      "peso": { "H": 20, "N": 5, "R": 5 }
    },
    {
      "valor": "breakage_fragile",
      "texto": "Cassants et fragiles",
      "peso": { "H": 10, "N": 5, "R": 30 }
    },
    {
      "valor": "frizz",
      "texto": "Avec beaucoup de frisottis",
      "peso": { "H": 5, "N": 25, "R": 0 }
    },
    {
      "valor": "tangled",
      "texto": "Emmêlés facilement",
      "peso": { "H": 15, "N": 20, "R": 0 }
    },
    {
      "valor": "split_ends",
      "texto": "Pointes fourchues",
      "peso": { "H": 10, "N": 5, "R": 25 }
    },
    {
      "valor": "healthy",
      "texto": "En bonne santé",
      "peso": { "H": 10, "N": 10, "R": 0 }
    }
  ]
}
```

**Justificativa:**
- Seco/opaco = falta de água (H)
- Frizz/embaraçado = falta de lipídios (N)
- Quebradiço/pontas duplas = dano proteico (R)
- Oleoso = reduz necessidade de N

---

## Q04 - Frequência de Lavagem

```json
{
  "id": "Q04",
  "nivel": "basico",
  "obrigatoria": true,
  "pergunta": "À quelle fréquence lavez-vous vos cheveux?",
  "tipo": "single_choice",
  "usado_para": "calcular_frequencia_cronograma",
  "opcoes": [
    {
      "valor": "1x",
      "texto": "1 fois par semaine",
      "peso": { "H": 0, "N": 0, "R": 0 }
    },
    {
      "valor": "2x",
      "texto": "2 fois par semaine",
      "peso": { "H": 0, "N": 0, "R": 0 }
    },
    {
      "valor": "3x",
      "texto": "3 fois par semaine",
      "peso": { "H": 0, "N": 0, "R": 0 }
    },
    {
      "valor": "more_than_3x_week",
      "texto": "Plus de 3 fois par semaine",
      "peso": { "H": 5, "N": -5, "R": 0 }
    }
  ]
}
```

**Nota:** Esta pergunta é principalmente para calcular a frequência do cronograma, mas lavar muito (>3x/semana) pode ressecar.

---

## Q05 - Comprimento do Cabelo

```json
{
  "id": "Q05",
  "nivel": "basico",
  "obrigatoria": true,
  "pergunta": "Quelle est la longueur de vos cheveux?",
  "tipo": "single_choice",
  "usado_para": "calcular_consumo",
  "opcoes": [
    {
      "valor": "short",
      "texto": "Courts (au-dessus des épaules)",
      "peso": { "H": 0, "N": 0, "R": 0 }
    },
    {
      "valor": "medium",
      "texto": "Mi-longs (jusqu'aux épaules)",
      "peso": { "H": 0, "N": 0, "R": 0 }
    },
    {
      "valor": "long",
      "texto": "Longs (en dessous des épaules)",
      "peso": { "H": 5, "N": 5, "R": 5 }
    },
    {
      "valor": "very_long",
      "texto": "Très longs (en dessous de la poitrine)",
      "peso": { "H": 10, "N": 10, "R": 10 }
    }
  ]
}
```

**Justificativa:** Cabelos mais longos = pontas mais antigas = maior necessidade de todos os tratamentos.

---

## Q06 - Exposição a Danos Externos

```json
{
  "id": "Q06",
  "nivel": "basico",
  "obrigatoria": true,
  "pergunta": "Utilisez-vous fréquemment des outils chauffants?",
  "subtitulo": "Sèche-cheveux, lisseur, fer à boucler",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "never",
      "texto": "Jamais ou rarement",
      "peso": { "H": 0, "N": 0, "R": 0 }
    },
    {
      "valor": "occasional",
      "texto": "1-2 fois par semaine",
      "peso": { "H": 10, "N": 5, "R": 15 }
    },
    {
      "valor": "frequent",
      "texto": "3-4 fois par semaine",
      "peso": { "H": 15, "N": 10, "R": 20 }
    },
    {
      "valor": "daily",
      "texto": "Tous les jours",
      "peso": { "H": 20, "N": 15, "R": 30 }
    }
  ]
}
```

---

## Q07 - Exposição Solar/Piscina

```json
{
  "id": "Q07",
  "nivel": "basico",
  "obrigatoria": false,
  "pergunta": "Êtes-vous souvent exposé(e) au soleil, à la mer ou au chlore?",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "no",
      "texto": "Non, rarement",
      "peso": { "H": 0, "N": 0, "R": 0 }
    },
    {
      "valor": "sun_occasional",
      "texto": "Oui, soleil occasionnel",
      "peso": { "H": 10, "N": 5, "R": 5 }
    },
    {
      "valor": "pool_frequent",
      "texto": "Oui, piscine chlorée fréquemment",
      "peso": { "H": 20, "N": 10, "R": 15 }
    },
    {
      "valor": "beach_frequent",
      "texto": "Oui, mer et soleil fréquemment",
      "peso": { "H": 25, "N": 15, "R": 20 }
    }
  ]
}
```

---

# 3. Nível Intermediário (10-15 perguntas)

*Adiciona 5-8 perguntas ao nível básico*

## Q08 - Porosidade Percebida

```json
{
  "id": "Q08",
  "nivel": "intermediario",
  "obrigatoria": true,
  "pergunta": "Comment vos cheveux réagissent-ils à l'eau?",
  "subtitulo": "Test de porosité simple",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "repels",
      "texto": "L'eau glisse, difficile à mouiller",
      "descricao": "Porosité faible - cuticule fermée",
      "peso": { "H": 15, "N": 25, "R": 0 }
    },
    {
      "valor": "absorbs_normal",
      "texto": "S'humidifient normalement",
      "descricao": "Porosité moyenne - cuticule légèrement ouverte",
      "peso": { "H": 10, "N": 10, "R": 0 }
    },
    {
      "valor": "absorbs_fast",
      "texto": "Absorbent l'eau rapidement, sèchent vite",
      "descricao": "Porosité haute - cuticule très ouverte",
      "peso": { "H": 20, "N": 30, "R": 10 }
    }
  ]
}
```

---

## Q09 - Elasticidade

```json
{
  "id": "Q09",
  "nivel": "intermediario",
  "obrigatoria": true,
  "pergunta": "Si vous étirez une mèche mouillée, que se passe-t-il?",
  "subtitulo": "Test d'élasticité",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "stretches_returns",
      "texto": "Elle s'étire et reprend sa forme",
      "descricao": "Bonne élasticité",
      "peso": { "H": 5, "N": 5, "R": 0 }
    },
    {
      "valor": "stretches_little",
      "texto": "Elle s'étire peu, assez rigide",
      "descricao": "Manque d'hydratation",
      "peso": { "H": 20, "N": 10, "R": 5 }
    },
    {
      "valor": "breaks",
      "texto": "Elle se casse facilement",
      "descricao": "Manque de protéines",
      "peso": { "H": 10, "N": 5, "R": 30 }
    }
  ]
}
```

---

## Q10 - Rotina Atual de Cuidados

```json
{
  "id": "Q10",
  "nivel": "intermediario",
  "obrigatoria": true,
  "pergunta": "Quelle est votre routine capillaire actuelle?",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "basic",
      "texto": "Shampooing uniquement",
      "peso": { "H": 20, "N": 15, "R": 10 }
    },
    {
      "valor": "conditioner_only",
      "texto": "Shampooing + après-shampooing",
      "peso": { "H": 10, "N": 10, "R": 0 }
    },
    {
      "valor": "mask_occasional",
      "texto": "Shampooing + masque occasionnel",
      "peso": { "H": 5, "N": 5, "R": 0 }
    },
    {
      "valor": "complete",
      "texto": "Routine complète (shampooing, masque, leave-in)",
      "peso": { "H": 0, "N": 0, "R": 0 }
    }
  ]
}
```

---

## Q11 - Volume e Densidade

```json
{
  "id": "Q11",
  "nivel": "intermediario",
  "obrigatoria": false,
  "pergunta": "Comment décririez-vous le volume de vos cheveux?",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "fine_low_density",
      "texto": "Fins et clairsemés",
      "peso": { "H": 10, "N": 10, "R": 15 }
    },
    {
      "valor": "medium",
      "texto": "Épaisseur moyenne",
      "peso": { "H": 5, "N": 5, "R": 5 }
    },
    {
      "valor": "thick_high_density",
      "texto": "Épais et denses",
      "peso": { "H": 0, "N": 5, "R": 0 }
    }
  ]
}
```

---

## Q12 - Tempo de Secagem

```json
{
  "id": "Q12",
  "nivel": "intermediario",
  "obrigatoria": false,
  "pergunta": "Combien de temps vos cheveux mettent-ils à sécher naturellement?",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "fast",
      "texto": "Moins de 1 heure (sèchent très vite)",
      "descricao": "Porosité haute ou cheveux très fins",
      "peso": { "H": 15, "N": 20, "R": 5 }
    },
    {
      "valor": "normal",
      "texto": "1-3 heures",
      "peso": { "H": 5, "N": 5, "R": 0 }
    },
    {
      "valor": "slow",
      "texto": "Plus de 3 heures (restent humides longtemps)",
      "descricao": "Porosité faible ou cheveux très épais",
      "peso": { "H": 10, "N": 25, "R": 0 }
    }
  ]
}
```

---

## Q13 - Reação a Produtos

```json
{
  "id": "Q13",
  "nivel": "intermediario",
  "obrigatoria": false,
  "pergunta": "Comment vos cheveux réagissent-ils aux produits riches (huiles, masques)?",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "absorbs_well",
      "texto": "Absorbent bien, restent doux",
      "peso": { "H": 5, "N": 5, "R": 0 }
    },
    {
      "valor": "gets_weighed_down",
      "texto": "Deviennent lourds et gras",
      "descricao": "Porosité faible, produits s'accumulent",
      "peso": { "H": 15, "N": -5, "R": 0 }
    },
    {
      "valor": "no_effect",
      "texto": "Peu d'effet visible",
      "descricao": "Porosité haute, produits pénètrent pas assez",
      "peso": { "H": 10, "N": 25, "R": 10 }
    }
  ]
}
```

---

## Q14 - Objetivo do Tratamento

```json
{
  "id": "Q14",
  "nivel": "intermediario",
  "obrigatoria": true,
  "pergunta": "Quel est votre objectif principal?",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "shine",
      "texto": "Avoir plus de brillance",
      "peso": { "H": 20, "N": 10, "R": 0 }
    },
    {
      "valor": "frizz_control",
      "texto": "Contrôler les frisottis",
      "peso": { "H": 5, "N": 25, "R": 0 }
    },
    {
      "valor": "less_breakage",
      "texto": "Réduire la casse",
      "peso": { "H": 10, "N": 5, "R": 30 }
    },
    {
      "valor": "growth",
      "texto": "Favoriser la pousse",
      "peso": { "H": 10, "N": 10, "R": 20 }
    },
    {
      "valor": "curl_definition",
      "texto": "Définir les boucles",
      "peso": { "H": 15, "N": 20, "R": 5 }
    },
    {
      "valor": "maintenance",
      "texto": "Maintenir en bonne santé",
      "peso": { "H": 10, "N": 10, "R": 5 }
    }
  ]
}
```

---

## Q15 - Histórico de Tratamentos

```json
{
  "id": "Q15",
  "nivel": "intermediario",
  "obrigatoria": false,
  "pergunta": "Avez-vous déjà fait un traitement capillaire professionnel?",
  "subtitulo": "Kératine, botox capillaire, cauterisation...",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "no",
      "texto": "Non, jamais",
      "peso": { "H": 0, "N": 0, "R": 0 }
    },
    {
      "valor": "keratin_recent",
      "texto": "Oui, kératine il y a moins de 6 mois",
      "peso": { "H": 15, "N": 10, "R": 5 }
    },
    {
      "valor": "botox_recent",
      "texto": "Oui, botox capillaire récemment",
      "peso": { "H": 10, "N": 5, "R": 0 }
    },
    {
      "valor": "other_old",
      "texto": "Oui, mais il y a plus de 6 mois",
      "peso": { "H": 5, "N": 5, "R": 5 }
    }
  ]
}
```

---

# 4. Nível Avançado (15-20 perguntas)

*Adiciona 5 perguntas ao nível intermediário*

## Q16 - Teste de Porosidade Detalhado

```json
{
  "id": "Q16",
  "nivel": "avancado",
  "obrigatoria": true,
  "pergunta": "Test du verre d'eau: Placez une mèche dans un verre. Que se passe-t-il?",
  "subtitulo": "Test de porosité professionnel",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "floats",
      "texto": "Elle flotte à la surface",
      "descricao": "Porosité très faible",
      "peso": { "H": 20, "N": 30, "R": 0 }
    },
    {
      "valor": "middle",
      "texto": "Elle reste au milieu",
      "descricao": "Porosité moyenne",
      "peso": { "H": 10, "N": 10, "R": 0 }
    },
    {
      "valor": "sinks",
      "texto": "Elle coule au fond rapidement",
      "descricao": "Porosité très haute",
      "peso": { "H": 15, "N": 35, "R": 15 }
    }
  ]
}
```

---

## Q17 - Espessura do Fio

```json
{
  "id": "Q17",
  "nivel": "avancado",
  "obrigatoria": true,
  "pergunta": "Quelle est l'épaisseur de vos cheveux individuels?",
  "subtitulo": "Comparez avec un fil à coudre",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "fine",
      "texto": "Plus fin qu'un fil (difficile à sentir)",
      "peso": { "H": 10, "N": 10, "R": 10 }
    },
    {
      "valor": "medium",
      "texto": "Similaire à un fil",
      "peso": { "H": 5, "N": 5, "R": 5 }
    },
    {
      "valor": "thick",
      "texto": "Plus épais qu'un fil",
      "peso": { "H": 0, "N": 0, "R": 0 }
    }
  ]
}
```

---

## Q18 - Densidade Capilar

```json
{
  "id": "Q18",
  "nivel": "avancado",
  "obrigatoria": false,
  "pergunta": "Quelle est la densité de vos cheveux?",
  "subtitulo": "Faites une queue de cheval et mesurez la circonférence",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "low",
      "texto": "Faible (moins de 5 cm de circonférence)",
      "peso": { "H": 10, "N": 10, "R": 15 }
    },
    {
      "valor": "medium",
      "texto": "Moyenne (5-10 cm)",
      "peso": { "H": 5, "N": 5, "R": 5 }
    },
    {
      "valor": "high",
      "texto": "Haute (plus de 10 cm)",
      "peso": { "H": 0, "N": 5, "R": 0 }
    }
  ]
}
```

---

## Q19 - Sensibilidade do Couro Cabeludo

```json
{
  "id": "Q19",
  "nivel": "avancado",
  "obrigatoria": false,
  "pergunta": "Votre cuir chevelu est-il sensible?",
  "tipo": "single_choice",
  "opcoes": [
    {
      "valor": "no",
      "texto": "Non, aucune sensibilité",
      "peso": { "H": 0, "N": 0, "R": 0 }
    },
    {
      "valor": "oily",
      "texto": "Oui, gras et avec pellicules",
      "peso": { "H": 0, "N": -10, "R": 0 }
    },
    {
      "valor": "dry",
      "texto": "Oui, sec et qui démange",
      "peso": { "H": 15, "N": 10, "R": 0 }
    },
    {
      "valor": "sensitive",
      "texto": "Oui, irrité facilement",
      "peso": { "H": 10, "N": 5, "R": 0 }
    }
  ]
}
```

---

## Q20 - Sazonalidade

```json
{
  "id": "Q20",
  "nivel": "avancado",
  "obrigatoria": false,
  "pergunta": "Vos cheveux changent-ils selon les saisons?",
  "tipo": "multiple_choice",
  "opcoes": [
    {
      "valor": "summer_dry",
      "texto": "Plus secs en été",
      "peso": { "H": 15, "N": 5, "R": 5 }
    },
    {
      "valor": "winter_static",
      "texto": "Plus électriques en hiver",
      "peso": { "H": 10, "N": 15, "R": 0 }
    },
    {
      "valor": "humidity_frizz",
      "texto": "Plus de frisottis par temps humide",
      "peso": { "H": 5, "N": 20, "R": 0 }
    },
    {
      "valor": "no_change",
      "texto": "Non, restent constants",
      "peso": { "H": 0, "N": 0, "R": 0 }
    }
  ]
}
```

---

# 5. Lógica Condicional

## 5.1 Árvore de Decisão

```typescript
const logicaCondicional = {
  // Se Q02 (química) = descoloração ou alisamento → mostrar Q15 (histórico tratamentos)
  "Q02": {
    "bleach": ["Q15"],
    "chemical_straightening": ["Q15"]
  },
  
  // Se Q03 (estado atual) inclui "breakage_fragile" → mostrar Q09 (elasticidade)
  "Q03": {
    "breakage_fragile": ["Q09"]
  },
  
  // Se Q04 (frequência lavagem) = mais de 3x → mostrar Q19 (couro cabeludo)
  "Q04": {
    "more_than_3x_week": ["Q19"]
  },
  
  // Se Q06 (ferramentas térmicas) = frequente ou diário → mostrar Q17 (espessura fio)
  "Q06": {
    "frequent": ["Q17"],
    "daily": ["Q17"]
  },
  
  // Se Q08 (porosidade) = alta → mostrar Q16 (teste detalhado)
  "Q08": {
    "absorbs_fast": ["Q16"]
  },
  
  // Se Q10 (rotina atual) = básica → enfatizar importância do tratamento
  "Q10": {
    "basic": ["REFORCAR_IMPORTANCIA"]
  }
};
```

## 5.2 Regras de Progressão

```typescript
const regraProgressao = {
  // Nível Básico → Intermediário
  basico_para_intermediario: {
    condicao: "usuario_completa_Q07",
    ou: "usuario_clica_mais_perguntas"
  },
  
  // Intermediário → Avançado
  intermediario_para_avancado: {
    condicao: "usuario_completa_Q15",
    ou: "usuario_envia_foto",  // Se enviou foto, mostrar avançado
    ou: "usuario_clica_diagnostico_completo"
  },
  
  // Pular para foto (opcional)
  basico_para_foto: {
    condicao: "usuario_completa_Q05",
    acao: "mostrar_opcao_enviar_foto"
  }
};
```

---

# 6. Sistema de Pontuação

## 6.1 Acumulação de Pontos

```typescript
interface PontuacaoAcumulada {
  H: number;  // Hidratação
  N: number;  // Nutrição
  R: number;  // Reconstrução
}

function acumularPontos(respostas: Resposta[]): PontuacaoAcumulada {
  const pontos = { H: 0, N: 0, R: 0 };
  
  respostas.forEach(resposta => {
    // Para single_choice
    if (resposta.tipo === 'single_choice') {
      pontos.H += resposta.peso.H;
      pontos.N += resposta.peso.N;
      pontos.R += resposta.peso.R;
    }
    
    // Para multiple_choice (soma todos selecionados)
    if (resposta.tipo === 'multiple_choice') {
      resposta.opcoesSelecionadas.forEach(opcao => {
        pontos.H += opcao.peso.H;
        pontos.N += opcao.peso.N;
        pontos.R += opcao.peso.R;
      });
    }
  });
  
  return pontos;
}
```

## 6.2 Normalização (0-100%)

```typescript
function normalizarPontos(pontos: PontuacaoAcumulada): DiagnosisResult {
  // 1. Garantir que nenhum valor seja negativo
  pontos.H = Math.max(0, pontos.H);
  pontos.N = Math.max(0, pontos.N);
  pontos.R = Math.max(0, pontos.R);
  
  // 2. Calcular total
  const total = pontos.H + pontos.N + pontos.R;
  
  // 3. Evitar divisão por zero
  if (total === 0) {
    return {
      hydrationNeed: 33,
      nutritionNeed: 33,
      reconstructionNeed: 34,
      dominantNeed: 'H'
    };
  }
  
  // 4. Normalizar para percentual
  let resultado = {
    hydrationNeed: Math.round((pontos.H / total) * 100),
    nutritionNeed: Math.round((pontos.N / total) * 100),
    reconstructionNeed: Math.round((pontos.R / total) * 100),
    dominantNeed: null as 'H' | 'N' | 'R'
  };
  
  // 5. Aplicar limites (R máximo 40%)
  if (resultado.reconstructionNeed > 40) {
    const excesso = resultado.reconstructionNeed - 40;
    resultado.reconstructionNeed = 40;
    
    // Redistribuir excesso para H e N proporcionalmente
    const ratioHN = resultado.hydrationNeed / (resultado.hydrationNeed + resultado.nutritionNeed);
    resultado.hydrationNeed += Math.round(excesso * ratioHN);
    resultado.nutritionNeed += excesso - Math.round(excesso * ratioHN);
  }
  
  // 6. Garantir mínimo de 10% para cada
  const ajustarMinimo = (campo: 'hydrationNeed' | 'nutritionNeed' | 'reconstructionNeed') => {
    if (resultado[campo] < 10) {
      const diferenca = 10 - resultado[campo];
      resultado[campo] = 10;
      
      // Subtrair dos outros proporcionalmente
      const outros = ['hydrationNeed', 'nutritionNeed', 'reconstructionNeed']
        .filter(c => c !== campo);
      
      outros.forEach(outro => {
        resultado[outro] = Math.max(10, resultado[outro] - Math.floor(diferenca / 2));
      });
    }
  };
  
  ajustarMinimo('hydrationNeed');
  ajustarMinimo('nutritionNeed');
  ajustarMinimo('reconstructionNeed');
  
  // 7. Ajustar para somar exatamente 100
  const soma = resultado.hydrationNeed + resultado.nutritionNeed + resultado.reconstructionNeed;
  if (soma !== 100) {
    resultado.hydrationNeed += (100 - soma);
  }
  
  // 8. Determinar necessidade dominante
  if (resultado.hydrationNeed > resultado.nutritionNeed && 
      resultado.hydrationNeed > resultado.reconstructionNeed) {
    resultado.dominantNeed = 'H';
  } else if (resultado.nutritionNeed > resultado.reconstructionNeed) {
    resultado.dominantNeed = 'N';
  } else {
    resultado.dominantNeed = 'R';
  }
  
  return resultado;
}
```

## 6.3 Regras de Validação

```typescript
function validarResultado(resultado: DiagnosisResult): boolean {
  // 1. Soma deve ser 100
  const soma = resultado.hydrationNeed + resultado.nutritionNeed + resultado.reconstructionNeed;
  if (soma !== 100) return false;
  
  // 2. Nenhum valor abaixo de 10%
  if (resultado.hydrationNeed < 10 || 
      resultado.nutritionNeed < 10 || 
      resultado.reconstructionNeed < 10) return false;
  
  // 3. R nunca acima de 40%
  if (resultado.reconstructionNeed > 40) return false;
  
  // 4. Necessidade dominante deve ser a maior
  const valores = {
    H: resultado.hydrationNeed,
    N: resultado.nutritionNeed,
    R: resultado.reconstructionNeed
  };
  
  const maior = Math.max(...Object.values(valores));
  if (valores[resultado.dominantNeed] !== maior) return false;
  
  return true;
}
```

---

# 7. Algoritmo de Cálculo

## 7.1 Fluxo Completo

```typescript
async function calcularDiagnostico(
  respostas: Resposta[],
  fotosSelecionadas?: { selfie: File, closeup: File }
): Promise<DiagnosisResult> {
  
  // 1. Acumular pontos do questionário
  const pontosQuestionario = acumularPontos(respostas);
  console.log('Pontos do questionário:', pontosQuestionario);
  
  // 2. Normalizar pontos do questionário
  const resultadoQuestionario = normalizarPontos(pontosQuestionario);
  console.log('Resultado normalizado:', resultadoQuestionario);
  
  // 3. Se não tiver fotos, retornar resultado do questionário
  if (!fotosSelecionadas) {
    return resultadoQuestionario;
  }
  
  // 4. Se tiver fotos, analisar com IA
  const analiseIA = await analisarFotosGemini(
    fotosSelecionadas.selfie,
    fotosSelecionadas.closeup
  );
  console.log('Análise IA:', analiseIA);
  
  // 5. Converter análise IA para necessidades
  const necessidadesIA = converterAnaliseParaNecessidades(analiseIA);
  console.log('Necessidades da IA:', necessidadesIA);
  
  // 6. Combinar questionário (70%) + IA (30%)
  const resultadoFinal = combinarDiagnosticos(
    resultadoQuestionario,
    necessidadesIA,
    0.7,  // peso questionário
    0.3   // peso IA
  );
  
  // 7. Validar resultado final
  if (!validarResultado(resultadoFinal)) {
    throw new Error('Resultado inválido gerado');
  }
  
  console.log('Resultado final:', resultadoFinal);
  return resultadoFinal;
}
```

## 7.2 Combinação Questionário + IA

```typescript
function combinarDiagnosticos(
  resultadoQuestionario: DiagnosisResult,
  resultadoIA: DiagnosisResult,
  pesoQuestionario: number,
  pesoIA: number
): DiagnosisResult {
  
  const combined = {
    hydrationNeed: Math.round(
      (resultadoQuestionario.hydrationNeed * pesoQuestionario) +
      (resultadoIA.hydrationNeed * pesoIA)
    ),
    nutritionNeed: Math.round(
      (resultadoQuestionario.nutritionNeed * pesoQuestionario) +
      (resultadoIA.nutritionNeed * pesoIA)
    ),
    reconstructionNeed: Math.round(
      (resultadoQuestionario.reconstructionNeed * pesoQuestionario) +
      (resultadoIA.reconstructionNeed * pesoIA)
    ),
    dominantNeed: null as 'H' | 'N' | 'R'
  };
  
  // Renormalizar para garantir soma = 100
  return normalizarPontos({
    H: combined.hydrationNeed,
    N: combined.nutritionNeed,
    R: combined.reconstructionNeed
  });
}

function converterAnaliseParaNecessidades(analise: GeminiAnalysis): DiagnosisResult {
  let H = 0, N = 0, R = 0;
  
  // Dryness → Hidratação (peso 0.8)
  H += analise.dryness * 0.8;
  
  // Frizz → Nutrição (peso 0.7)
  N += analise.frizz * 0.7;
  
  // Oiliness → reduz Nutrição
  N -= analise.oiliness * 0.3;
  
  // Shine → reduz Hidratação (se tem brilho, não precisa tanto H)
  H -= (100 - analise.shine) * 0.3;
  
  // Damage → Reconstrução
  if (analise.damage === 'severe') R += 60;
  else if (analise.damage === 'moderate') R += 35;
  else R += 15;
  
  // Breakage → Reconstrução adicional
  if (analise.breakage) R += 20;
  
  // Porosity → Nutrição
  if (analise.porosity === 'high') N += 40;
  else if (analise.porosity === 'medium') N += 20;
  else if (analise.porosity === 'low') N += 30;  // Porosidade baixa também precisa N
  
  // Normalizar
  return normalizarPontos({ H, N, R });
}
```

---

# 8. Implementação JSON

## 8.1 Estrutura Completa do Questionário

```json
{
  "versao": "1.0",
  "idioma": "fr-FR",
  "niveis": {
    "basico": {
      "nome": "Diagnostic Rapide",
      "descricao": "5-7 questions essentielles",
      "duracao_estimada": "2 min",
      "perguntas": ["Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07"]
    },
    "intermediario": {
      "nome": "Diagnostic Complet",
      "descricao": "10-15 questions détaillées",
      "duracao_estimada": "4 min",
      "perguntas": ["Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", 
                    "Q08", "Q09", "Q10", "Q11", "Q12", "Q13", "Q14", "Q15"]
    },
    "avancado": {
      "nome": "Diagnostic Professionnel",
      "descricao": "15-20 questions professionnelles",
      "duracao_estimada": "6 min",
      "perguntas": ["Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07",
                    "Q08", "Q09", "Q10", "Q11", "Q12", "Q13", "Q14", "Q15",
                    "Q16", "Q17", "Q18", "Q19", "Q20"]
    }
  },
  "perguntas": [
    /* Q01-Q20 conforme documentado acima */
  ],
  "logicaCondicional": {
    /* conforme seção 5.1 */
  },
  "pesos": {
    "questionario_sem_foto": 1.0,
    "questionario_com_foto": 0.7,
    "ia_com_foto": 0.3
  },
  "limites": {
    "minimo_por_tipo": 10,
    "maximo_reconstrucao": 40,
    "soma_total": 100
  }
}
```

---

## Resumo Executivo

Este questionário permite diagnosticar com precisão as necessidades capilares através de:

- ✅ **20 perguntas** cientificamente embasadas
- ✅ **3 níveis** de profundidade (básico, intermediário, avançado)
- ✅ **Sistema de pesos** calibrado para H/N/R
- ✅ **Lógica condicional** inteligente
- ✅ **Normalização** matemática rigorosa
- ✅ **Combinação** com análise de IA (opcional)
- ✅ **Validação** de resultados
- ✅ **100% em francês** para mercado francês

---

**Documento criado por:** Inove AI  
**Data:** 05 de Fevereiro de 2026  
**Status:** Pronto para implementação
