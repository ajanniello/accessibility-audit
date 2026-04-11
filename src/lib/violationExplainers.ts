export interface ViolationExplainer {
  plainSummary: string;  // one sentence a non-developer can understand
  whoIsAffected: string; // which users this harms and how
  realWorldImpact: string; // concrete example of what breaks
}

// Keyed by axe-core rule ID.
// Falls back to a generic explainer for rules not listed here.
const EXPLAINERS: Record<string, ViolationExplainer> = {
  "aria-allowed-attr": {
    plainSummary:
      "Some elements have accessibility labels that don't match what that element is allowed to have.",
    whoIsAffected:
      "Screen reader users (people who are blind or have low vision). Screen readers rely on these labels to announce what each button, link, or widget does.",
    realWorldImpact:
      "A screen reader might announce a button incorrectly — for example, reading out confusing or irrelevant information — making it hard or impossible to understand what the button does without seeing it.",
  },
  "aria-required-attr": {
    plainSummary:
      "Some interactive elements are missing required accessibility information.",
    whoIsAffected:
      "Screen reader users who navigate by keyboard or assistive technology.",
    realWorldImpact:
      "A dropdown menu or custom widget may be announced without its current state (e.g. expanded or collapsed), leaving users confused about what will happen if they interact with it.",
  },
  "aria-hidden-focus": {
    plainSummary:
      "Some elements are hidden from screen readers but can still be reached by pressing Tab on the keyboard.",
    whoIsAffected:
      "Keyboard-only users and screen reader users.",
    realWorldImpact:
      "A user pressing Tab to navigate will land on an invisible or meaningless element, with no audio cue about what it is — like falling into a hole that isn't on the map.",
  },
  "color-contrast": {
    plainSummary:
      "Some text doesn't have enough color difference from its background to be easily readable.",
    whoIsAffected:
      "People with low vision, color blindness, or anyone reading on a bright screen outdoors.",
    realWorldImpact:
      "Light grey text on a white background, for example, may be nearly invisible. WCAG requires a contrast ratio of at least 4.5:1 for normal text.",
  },
  "image-alt": {
    plainSummary:
      "One or more images have no text description.",
    whoIsAffected:
      "People who are blind or have low vision and use screen readers, as well as users on slow connections where images don't load.",
    realWorldImpact:
      "A screen reader will say \"image\" with no further detail, or read out the file name (e.g. \"img_3847.jpg\"), which is meaningless. Important visual content like product photos or infographics becomes completely inaccessible.",
  },
  "button-name": {
    plainSummary:
      "One or more buttons have no readable label.",
    whoIsAffected:
      "Screen reader users and keyboard users.",
    realWorldImpact:
      "A screen reader will announce \"button\" with no name — the user has no idea what pressing it will do. Icon-only buttons (like a search magnifying glass) are a common offender.",
  },
  "link-name": {
    plainSummary:
      "One or more links have no readable label.",
    whoIsAffected:
      "Screen reader users who rely on link text to understand where a link goes.",
    realWorldImpact:
      "Screen readers often list all links on a page to help users navigate. A link announced as \"click here\" or just \"link\" out of context is impossible to distinguish from other links.",
  },
  "label": {
    plainSummary:
      "One or more form fields (like text inputs or checkboxes) have no label.",
    whoIsAffected:
      "Screen reader users filling out forms.",
    realWorldImpact:
      "When a user focuses on an unlabeled input field, their screen reader announces nothing meaningful — they don't know whether to type their name, email address, or phone number.",
  },
  "duplicate-id-active": {
    plainSummary:
      "Multiple interactive elements on the page share the same ID.",
    whoIsAffected:
      "Screen reader users and users of assistive technology.",
    realWorldImpact:
      "Assistive technologies use IDs to connect labels to inputs and descriptions to buttons. Duplicate IDs break these connections, causing fields to be announced with the wrong label.",
  },
  "landmark-one-main": {
    plainSummary:
      "The page is missing a clearly defined main content area.",
    whoIsAffected:
      "Screen reader users who use keyboard shortcuts to skip to main content.",
    realWorldImpact:
      "A common screen reader shortcut lets users jump straight to the main content, skipping the navigation bar. Without a main landmark, this shortcut does nothing — forcing users to Tab through every nav item on every page.",
  },
  "region": {
    plainSummary:
      "Some page content isn't organized into navigable sections.",
    whoIsAffected:
      "Screen reader users who navigate by landmarks (sections of the page).",
    realWorldImpact:
      "Without clear regions, users can't quickly jump to the part of the page they need — they must listen to the entire page from top to bottom.",
  },
  "html-has-lang": {
    plainSummary:
      "The page doesn't declare what language it's written in.",
    whoIsAffected:
      "Screen reader users whose software needs to know the language to pronounce words correctly.",
    realWorldImpact:
      "A screen reader set to English encountering a French page without a language tag may mispronounce every word, making the content incomprehensible.",
  },
  "document-title": {
    plainSummary:
      "The page has no title.",
    whoIsAffected:
      "Screen reader users, and anyone using browser tabs.",
    realWorldImpact:
      "When a screen reader opens a page, the first thing it reads is the page title. Without one, the user has no context for what the page is. In a browser, the tab just shows the URL.",
  },
  "frame-title": {
    plainSummary:
      "An embedded frame (like an ad or video player) has no label.",
    whoIsAffected:
      "Screen reader users who navigate between frames.",
    realWorldImpact:
      "Screen readers announce frames as users tab through a page. An unlabeled frame is announced as \"frame\" with no description, giving no indication of whether it contains an advertisement, a video, or a form.",
  },
  "meta-refresh": {
    plainSummary:
      "The page automatically refreshes or redirects after a short time.",
    whoIsAffected:
      "Screen reader users and people with cognitive disabilities.",
    realWorldImpact:
      "If a page refreshes while a screen reader user is in the middle of reading it, they lose their place and are sent back to the top — like having a book close and reopen to page one every few minutes.",
  },
  "scrollable-region-focusable": {
    plainSummary:
      "A scrollable area on the page can't be reached with the keyboard.",
    whoIsAffected:
      "Keyboard-only users who can't use a mouse.",
    realWorldImpact:
      "If a text box or content panel scrolls but isn't reachable via Tab, keyboard users simply cannot access whatever content is inside it.",
  },
  "autocomplete-valid": {
    plainSummary:
      "Some form fields have an incorrect autocomplete setting.",
    whoIsAffected:
      "People with motor disabilities who rely on browser autofill to avoid retyping personal information.",
    realWorldImpact:
      "When autocomplete hints are wrong, the browser might offer to fill in a name field with an email address, or autofill won't work at all — making forms much harder for users who struggle to type.",
  },
};

const GENERIC_EXPLAINER: ViolationExplainer = {
  plainSummary:
    "This element doesn't meet an accessibility requirement.",
  whoIsAffected:
    "Users of screen readers, keyboard navigation, or other assistive technologies.",
  realWorldImpact:
    "Depending on the issue, this could prevent some users from reading content, interacting with a feature, or understanding the purpose of an element on the page.",
};

export function getExplainer(ruleId: string): ViolationExplainer {
  return EXPLAINERS[ruleId] ?? GENERIC_EXPLAINER;
}
