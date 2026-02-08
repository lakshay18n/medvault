import { MEDICINE_NAME_PRESETS } from "./medicineNamePresets";

export function matchMedicineName(parsedName) {
  if (!parsedName) return "";

  const lowerParsed = parsedName.toLowerCase();

  // 1️⃣ direct substring match
  const directMatch = MEDICINE_NAME_PRESETS.find((preset) =>
    lowerParsed.includes(preset.toLowerCase())
  );

  if (directMatch) return directMatch;

  // 2️⃣ fallback: return parsed name itself
  return parsedName;
}
