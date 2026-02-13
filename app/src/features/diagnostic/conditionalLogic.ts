// Adaptive conditional logic - no level selection needed
// The system decides which questions to ask based on answers

import { CORE_QUESTION_IDS } from "./questions";

type Answers = Record<string, string | string[]>;

interface AdaptiveRule {
  triggerQuestion: string;
  triggerValues: string[];
  addQuestions: string[];
}

// Adaptive rules: if user answers X, add question Y
const ADAPTIVE_RULES: AdaptiveRule[] = [
  // Q02 bleach/chemical → Q15 (treatment history)
  { triggerQuestion: "Q02", triggerValues: ["bleach", "chemical_straightening"], addQuestions: ["Q15"] },
  // Q03 breakage → Q09 (elasticity test)
  { triggerQuestion: "Q03", triggerValues: ["breakage_fragile"], addQuestions: ["Q09"] },
  // Q06 frequent/daily heat → Q17 (strand thickness)
  { triggerQuestion: "Q06", triggerValues: ["frequent", "daily"], addQuestions: ["Q17"] },
  // Complex profile (chemical + damage symptoms) → Q08 (porosity) + Q10 (routine)
  { triggerQuestion: "Q02", triggerValues: ["bleach", "chemical_straightening", "coloring_lt_3_months"], addQuestions: ["Q08", "Q10"] },
  // Q08 high porosity → Q16 (water glass test)
  { triggerQuestion: "Q08", triggerValues: ["absorbs_fast"], addQuestions: ["Q16"] },
];

/**
 * Compute visible question IDs using the adaptive flow.
 * Starts with 6 core questions, adds conditional ones based on answers.
 */
export function getAdaptiveQuestions(answers: Answers): string[] {
  const triggered = new Set<string>();

  for (const rule of ADAPTIVE_RULES) {
    const answer = answers[rule.triggerQuestion];
    if (!answer) continue;

    const selectedValues = Array.isArray(answer) ? answer : [answer];
    const matches = selectedValues.some((v) => rule.triggerValues.includes(v));
    if (matches) {
      for (const qId of rule.addQuestions) {
        triggered.add(qId);
      }
    }
  }

  // Build final list: core questions + triggered, inserting after trigger question
  const coreSet = new Set(CORE_QUESTION_IDS as readonly string[]);
  const orderedQuestions: string[] = [...CORE_QUESTION_IDS];

  // Full canonical ordering for stable insertion
  const ALL_IDS = [
    "Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q08", "Q09", "Q10",
    "Q11", "Q12", "Q13", "Q14", "Q15", "Q16", "Q17", "Q18", "Q19", "Q20",
  ];

  for (const qId of ALL_IDS) {
    if (triggered.has(qId) && !coreSet.has(qId)) {
      // Insert after the trigger question for best context
      const triggerRule = ADAPTIVE_RULES.find((r) => r.addQuestions.includes(qId));
      if (triggerRule) {
        const triggerIdx = orderedQuestions.indexOf(triggerRule.triggerQuestion);
        if (triggerIdx !== -1) {
          orderedQuestions.splice(triggerIdx + 1, 0, qId);
          continue;
        }
      }
      // Fallback: insert before Q14 (closing question)
      const q14Idx = orderedQuestions.indexOf("Q14");
      if (q14Idx !== -1) {
        orderedQuestions.splice(q14Idx, 0, qId);
      } else {
        orderedQuestions.push(qId);
      }
    }
  }

  // Deduplicate (in case of overlapping rules)
  return [...new Set(orderedQuestions)];
}

/** @deprecated Use getAdaptiveQuestions instead */
export function getVisibleQuestions(_level: string, answers: Answers): string[] {
  return getAdaptiveQuestions(answers);
}
