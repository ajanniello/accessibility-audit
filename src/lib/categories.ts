export type Category =
  | "all"
  | "color"
  | "images"
  | "keyboard"
  | "aria"
  | "forms"
  | "structure";

export const CATEGORY_LABELS: Record<Category, string> = {
  all: "All Issues",
  color: "Color & Contrast",
  images: "Images & Media",
  keyboard: "Keyboard Access",
  aria: "ARIA & Roles",
  forms: "Forms & Labels",
  structure: "Structure & Headings",
};

export const CATEGORY_TAGS: Record<Exclude<Category, "all">, string[]> = {
  color:     ["cat.color", "wcag143", "wcag1411"],
  images:    ["cat.text-alternatives", "cat.sensory-and-visual-cues"],
  keyboard:  ["cat.keyboard", "wcag21a", "wcag211", "wcag212", "wcag213"],
  aria:      ["cat.aria", "cat.name-role-value"],
  forms:     ["cat.forms", "wcag131", "wcag332", "wcag333", "wcag334"],
  structure: ["cat.structure", "cat.semantics", "cat.language", "cat.parsing"],
};

export function getCategoryForViolation(tags: string[]): Category {
  for (const [cat, catTags] of Object.entries(CATEGORY_TAGS) as [Exclude<Category, "all">, string[]][]) {
    if (tags.some((t) => catTags.some((ct) => t.includes(ct.replace("cat.", "cat.")) || t === ct))) {
      return cat;
    }
  }
  return "structure";
}

export const CATEGORY_ICONS: Record<Category, string> = {
  all: "LayoutGrid",
  color: "Palette",
  images: "Image",
  keyboard: "Keyboard",
  aria: "Code2",
  forms: "FormInput",
  structure: "AlignLeft",
};
