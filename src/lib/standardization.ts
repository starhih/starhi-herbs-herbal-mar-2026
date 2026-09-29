/**
 * Splits a product's listed standardization into individual grades a buyer can pick.
 *
 * Handles the formats used in the catalogue:
 *   "20%, 40% Tannins"                        -> "20% Tannins", "40% Tannins"
 *   "Boswellic Acids-25%, AKBBA-30%, 40%"     -> "25% Boswellic Acids", "30% AKBBA", "40% AKBBA"
 *   "3000IU/g, 4000IU/g"                      -> "3000IU/g", "4000IU/g"
 *   "2% (beadlets), 2%, 95% Capsaicin"        -> "2% Capsaicin (beadlets)", "2% Capsaicin", "95% Capsaicin"
 *   "0.35% Withaferin A; 1.5%, 2.5% Withanolides"
 *   "Ca Salt 50%, 60%; Hydroxy Citric Acid"   -> "50% Hydroxy Citric Acid (Ca Salt)", ...
 *
 * Kept as a single option: specs combining different markers ("2% Ursolic Acid, 2.5% Eugenol"),
 * ranges ("10% to 50% Bacosides") and descriptive text ("Natural vitamin B1, B2, B3").
 */

// A bare amount such as "40%"
const BARE_PERCENT = /^(\d+(?:\.\d+)?\s*%)$/;
// Amount first: "40% Tannins", "2% (beadlets)"
const PERCENT_THEN_LABEL = /^(\d+(?:\.\d+)?\s*%)\s+(.+)$/;
// Label first: "Boswellic Acids-25%", "AKBBA: 30%", "Ca Salt 50%"
const LABEL_THEN_PERCENT = /^(.*[A-Za-z].*?)\s*[-:–]?\s*(\d+(?:\.\d+)?\s*%)$/;
// A self-contained amount with its own unit: "3000IU/g", "10:1", "20 mg/g"
const UNIT_VALUE = /^(\d[\d.]*\s*(?:[A-Za-z%/µ]+[A-Za-z/]*|:\s*\d+))$/;

interface Grade {
  value: string;
  /** Marker compound, e.g. "Tannins" */
  label?: string;
  /** Form or variant, e.g. "beadlets" or "Ca Salt" */
  qualifier?: string;
  /** Complete on its own (e.g. "3000IU/g"); never borrows a label */
  standalone?: boolean;
}

function parsePiece(text: string): Grade | null {
  let m = text.match(BARE_PERCENT);
  if (m) return { value: m[1] };
  m = text.match(PERCENT_THEN_LABEL);
  if (m) {
    const rest = m[2].trim();
    // "2% (beadlets)" names a form, not the marker
    const qualifier = rest.match(/^\((.+)\)$/);
    return qualifier ? { value: m[1], qualifier: qualifier[1] } : { value: m[1], label: rest };
  }
  m = text.match(LABEL_THEN_PERCENT);
  if (m) return { value: m[2], label: m[1].replace(/[-:–]\s*$/, '').trim() };
  m = text.match(UNIT_VALUE);
  if (m) return { value: m[1], standalone: true };
  return null;
}

/** Parses one ";"-separated group. Returns null when it is not a list of grades. */
function parseGroup(group: string): Grade[] | null {
  // Split on commas, but not thousands separators like "1,000 IU"
  const raw = group.split(/,(?!\d{3}\b)/).map((p) => p.trim()).filter(Boolean);
  const pieces = raw.map(parsePiece);
  if (pieces.some((p) => p === null)) return null;
  const grades = pieces as Grade[];

  // Every piece names its own different marker: one combined spec, not alternatives
  const labels = grades.map((g) => g.label);
  if (grades.length > 1 && labels.every(Boolean) && new Set(labels).size > 1 && !grades.some((g) => g.standalone)) {
    return null;
  }

  // Unlabelled amounts borrow the nearest marker: the previous one for "Label-25%, 30%",
  // otherwise the next one for "20%, 40% Tannins"
  return grades.map((grade, index) => {
    if (grade.standalone || grade.label) return grade;
    const before = grades.slice(0, index).reverse().find((g) => g.label);
    const after = grades.slice(index + 1).find((g) => g.label);
    return { ...grade, label: before?.label ?? after?.label };
  });
}

function format(grade: Grade) {
  return [grade.value, grade.label, grade.qualifier && `(${grade.qualifier})`].filter(Boolean).join(' ');
}

export function parseStandardizationOptions(text?: string | null): string[] {
  if (!text?.trim()) return [];
  const groups = text.split(';').map((g) => g.trim()).filter(Boolean);

  // A trailing group without any amount names the marker for all groups:
  // "Ca Salt 50%, 60%; Water Soluble 50%; Hydroxy Citric Acid"
  let commonMarker: string | undefined;
  if (groups.length > 1 && !/\d/.test(groups[groups.length - 1])) {
    commonMarker = groups.pop();
  }

  const options: string[] = [];
  for (const group of groups) {
    const grades = parseGroup(group);
    if (!grades) {
      options.push(group);
      continue;
    }
    for (const grade of grades) {
      options.push(
        format(
          commonMarker && !grade.standalone
            ? { value: grade.value, label: commonMarker, qualifier: grade.label ?? grade.qualifier }
            : grade,
        ),
      );
    }
  }
  if (commonMarker && options.length === 0) options.push(commonMarker);

  return Array.from(new Set(options.map((o) => o.replace(/\s+/g, ' ').trim())));
}
