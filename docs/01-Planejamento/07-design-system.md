# Design System: CronoCapilar (CHS)

## Metadados
- **Baseado em:** UX Concept, Visual Mockups, Identity Visual (CHS)
- **Data:** 2026-02-06
- **Autor:** AI Frontend Specialist
- **Framework CSS:** Tailwind CSS + shadcn/ui
- **Versão:** 1.1
- **Status:** Aprovado para implementação

---

## 1. Fundamentos

### 1.1 Princípios de Design
1. **Premium & Sophistiqué:** Refletir a exclusividade da Cosmetic Hair Shop através de um visual limpo e minimalista.
2. **Confiance Technique:** Usar tipografia e cores que transmitam a precisão do diagnóstico por IA.
3. **Clarté Absolue:** Interface sem distrações, focada na jornada de cuidado capilar.

### 1.2 Tom Visual
- **Personalidade:** Alta-costura da cosmética capilar.
- **Sensação:** Especializado, luxuoso, confiável e tipicamente francês.

---

## 2. Paleta de Cores

### 2.1 Cores Principais
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-gold-500` | `#ECB613` | Cor de destaque primária (Botões, ícones de progresso). |
| `--color-gold-600` | `#D4A20F` | Hover em elementos dourados. |
| `--color-black` | `#000000` | Texto principal, backgrounds escuros, logos. |
| `--color-white` | `#FFFFFF` | Background principal, textos em áreas escuras. |

### 2.2 Cores Semânticas
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-success` | `#047857` | Confirmação de aplicação, diagnóstico concluído. (emerald-700, ratio ~5.2:1 sobre branco) |
| `--color-warning` | `#F59E0B` | Background de alertas de sessão atrasada. Usar `#92400E` (amber-800, ratio ~7.2:1) para texto. |
| `--color-warning-text` | `#92400E` | Texto de avisos sobre fundo claro. |
| `--color-error` | `#B91C1C` | Erro no upload da foto, falha na sincronização. (red-700, ratio ~5.7:1 sobre branco) |
| `--color-info` | `#1D4ED8` | Tooltips, banners informativos, estados neutros. |

### 2.3 Escala de Cinzas (Neutras)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-gray-50` | `#F9FAFB` | Backgrounds de cards leves. |
| `--color-gray-100` | `#F3F4F6` | Backgrounds secundários. |
| `--color-gray-200` | `#E5E7EB` | Bordas visíveis, dividers. |
| `--color-gray-300` | `#D1D5DB` | Bordas sutis, inputs default. |
| `--color-gray-400` | `#9CA3AF` | Placeholders, ícones inativos. |
| `--color-gray-500` | `#6B7280` | Texto desabilitado. |
| `--color-gray-600` | `#4B5563` | Texto secundário e descrições. |
| `--color-gray-700` | `#374151` | Texto terciário forte. |
| `--color-gray-800` | `#1F2937` | Texto em superfícies escuras. |
| `--color-gray-900` | `#111827` | Headlines, texto primário alternativo. |

---

## 3. Tipografia

### 3.1 Famílias
| Propósito | Fonte | Estilo |
|-----------|-------|--------|
| **Headlines** | `Newsreader, 'Times New Roman', Georgia, serif` | Sofisticado, Clássico. |
| **Body/UI** | `Manrope, 'Segoe UI', system-ui, sans-serif` | Moderno, Legível. |

### 3.2 Escala Tipográfica
- **H1 (Hero):** 36px | Line-height: 1.1 | Bold (Serif)
- **H2 (Section):** 28px | Line-height: 1.2 | Semi-bold (Serif)
- **H3 (Subsection):** 22px | Line-height: 1.3 | Semi-bold (Serif)
- **H4 (Card Title):** 18px | Line-height: 1.3 | Medium (Sans)
- **Body Base:** 16px | Line-height: 1.5 | Regular (Sans)
- **Body Small:** 14px | Line-height: 1.4 | Regular (Sans)
- **Caption/Label:** 12px | Line-height: 1.4 | Medium (Sans)
- **Overline:** 11px | Line-height: 1.5 | Semi-bold, Uppercase, Letter-spacing: 0.05em (Sans)

---

## 4. Componentes (Tokens shadcn/ui)

### 4.1 Botões (Variants)
- **Primary (Gold):** Background `#ECB613`, texto preto (`#000000`), rounded-full. Ratio: 11.27:1 (AAA).
- **Secondary (Black):** Background `#000000`, texto branco, rounded-full.
- **Ghost:** Sem fundo, texto dourado, para ações menos prioritárias.

### 4.2 Inputs & Card Style
- **Input:** Borda fina preta ou dourada (em foco), fundo branco imaculado.
- **Card:** Sombra extremamente sutil, borda `1px` em `gray-300`, fundo `white`.

### 4.3 Estados de Componentes
| Componente | Default | Hover | Focus | Disabled | Loading | Error |
|------------|---------|-------|-------|----------|---------|-------|
| **Button Primary** | Gold bg, black text | Gold-600 bg, black text | Gold ring 2px | Gray-300 bg, gray-500 text | Spinner icon | - |
| **Button Secondary** | Black bg, white text | Gray-800 bg | Black ring 2px | Gray-300 bg, gray-500 text | Spinner icon | - |
| **Input** | Gray-300 border | Gold-500 border | Gold ring 2px | Gray-100 bg | - | Error border + icon |
| **Card** | White bg, subtle shadow | Elevated shadow | Gold ring 2px | Opacity 50% | Skeleton pulse | Red border |
| **Checkbox** | Gray-300 border | Gold-500 border | Gold ring | Gray-300 (no pointer) | - | Error border |

---

## 5. Sistema de Espaçamento

### 5.1 Unidade Base
- **Base Unit:** 4px
- **Escala:** Múltiplos de 4 (Tailwind default)

### 5.2 Tokens de Spacing
| Token | Valor | Uso |
|-------|-------|-----|
| `--space-1` | 4px | Micro-espaçamento (ícones inline) |
| `--space-2` | 8px | Espaçamento entre elementos relacionados |
| `--space-3` | 12px | Padding interno de inputs |
| `--space-4` | 16px | Padding de cards e seções |
| `--space-6` | 24px | Gap entre seções |
| `--space-8` | 32px | Margens de container |
| `--space-12` | 48px | Separação de blocos principais |
| `--space-16` | 64px | Padding vertical de hero sections |

### 5.3 Tokens de Border Radius
| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-none` | 0px | Elementos retangulares |
| `--radius-sm` | 4px | Inputs, chips |
| `--radius-md` | 8px | Cards, dropdowns |
| `--radius-lg` | 16px | Modals, sheets |
| `--radius-full` | 9999px | Botões, avatares, badges |

### 5.4 Tokens de Sombra (Elevation)
| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards em repouso |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Cards em hover, dropdowns |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, sheets |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.1)` | Overlays |

### 5.5 Tokens de Motion
| Token | Valor | Uso |
|-------|-------|-----|
| `--duration-fast` | 150ms | Hover, focus, micro-interações |
| `--duration-normal` | 250ms | Transições de componentes |
| `--duration-slow` | 400ms | Abertura de modais, page transitions |
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transição padrão |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elementos saindo |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elementos entrando |

**Acessibilidade:** Respeitar `@media (prefers-reduced-motion: reduce)` desabilitando animações.

### 5.6 Tokens de Z-Index
| Token | Valor | Uso |
|-------|-------|-----|
| `--z-base` | 0 | Conteúdo padrão |
| `--z-dropdown` | 100 | Menus dropdown, popovers |
| `--z-sticky` | 200 | Bottom bar, headers fixos |
| `--z-overlay` | 300 | Backdrop de modais |
| `--z-modal` | 400 | Modais, dialogs |
| `--z-toast` | 500 | Toasts, notificações |

---

## 6. Sistema de Layout

### 6.1 Breakpoints
| Nome | Min-width | Descrição |
|------|-----------|-----------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / Desktop |
| `xl` | 1280px | Desktop wide |

### 6.2 Container
```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px; /* --space-4 */
}
@media (min-width: 768px) {
  .container { padding: 0 32px; } /* --space-8 */
}
```

### 6.3 Grid System
- **Colunas:** 4 (mobile) | 8 (tablet) | 12 (desktop)
- **Gutter:** 16px (mobile) | 24px (desktop)
- **Margin:** 16px (mobile) | 32px (desktop)

---

## 7. Iconografia & Mídia
- **Biblioteca:** `Lucide React` (Traços finos de 1.5px).
- **Icons Chave:** `ScanFace`, `Calendar`, `Bell`, `User`, `CheckCircle`.
- **Fotos:** Estilo editorial de beleza, alta definição, iluminação natural.

---

## 8. Acessibilidade (WCAG 2.1)
- **Contraste Gold:** O Dourado (`#ECB613`) usa texto preto (`#000000`) para garantir ratio de 11.27:1 (AAA). Nunca usar texto branco sobre gold.
- **Cores Semânticas:** Success (`#047857`), Error (`#B91C1C`) e Info (`#1D4ED8`) passam WCAG AA sobre fundo branco. Warning usa `#92400E` para texto.
- **Focus Ring:** Usar `--color-black` para `focus-visible` sobre fundo branco, garantindo visibilidade máxima. Usar `--color-gold-500` para focus sobre fundo escuro.
- **Motion:** Respeitar `@media (prefers-reduced-motion: reduce)` desabilitando todas as animações não essenciais (ver seção 5.5).
- **Interação:** Botões mobile com altura mínima de `48px`.
- **Tradução:** Chaves de i18n configuradas para suportar o contexto cultural francês.

### 8.1 Checklist por Componente
| Componente | Regra A11y | Validação |
|------------|------------|-----------|
| Button | foco visível + nome acessível | RTL + Playwright a11y |
| Input | label explícita + erro associado (`aria-describedby`) | RTL + axe |
| Modal | trap de foco + close por teclado | Playwright |
| Calendar Bar | navegação por teclado + contraste de estado ativo | Playwright + revisão manual |
| Dropzone | instrução textual + feedback de erro | teste manual e snapshot |

### 8.2 Política de Tema
- **Dark mode:** fora do escopo do MVP.
- Todos os tokens são definidos para tema claro com contraste AA.
- Evolução para dark mode só após estabilização do MVP e sem quebrar tokens existentes.

### 8.3 QA Visual
1. Snapshot visual obrigatório para telas críticas: Landing, Diagnóstico, Cronograma.
2. Diferença visual máxima permitida em regressão: 0.3%.
3. Qualquer regressão em componente P0 bloqueia merge.

---

## 9. GAP Analysis: Design System

### 9.1 Component Coverage
| Componente | Necessário | Existe (shadcn) | GAP | Prioridade |
|-----------|-----------|-----------------|-----|------------|
| Calendar Bar | Sim | Parcial | Customização para 7 dias mobile | P0 |
| Photo Dropzone | Sim | Não | Implementação de preview + guia | P0 |
| IA Progress | Sim | Sim | Customização de cores CHS | P1 |

### 9.2 GAP Inventory
| ID | Área | AS-IS | TO-BE | GAP | Severidade | Prioridade |
|----|------|-------|-------|-----|------------|------------|
| G-DS-01 | Tipografia | Default | Newsreader/Manrope | Configuração de Google Fonts | Média | P1 |
| G-DS-02 | Assets | Sem imagens | Fotos Premium | Produção/Seleção de banco de luxo | Média | P1 |
