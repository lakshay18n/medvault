// export const parseMedicines = (ocrText) => {
//   const lines = ocrText.split("\n");

//   const dosageRegex =
//     /(1-0-1|0-1-0|1-1-1|OD|BD|TDS|HS|once daily|twice daily)/i;

//   const medicines = [];

//   lines.forEach((line) => {
//     const clean = line.trim();

//     if (clean.length < 6) return;

//     // ignore hospital / noise
//     if (
//       clean.toLowerCase().includes("hospital") ||
//       clean.toLowerCase().includes("medical") ||
//       clean.toLowerCase().includes("research") ||
//       clean.toLowerCase().includes("college")
//     ) {
//       return;
//     }

//     const hasNumber = /\d/.test(clean);
//     const hasDosage = dosageRegex.test(clean);

//     if (hasNumber || hasDosage) {
//       medicines.push({
//         name: clean,
//         dosage: hasDosage ? clean.match(dosageRegex)[0] : "as prescribed",
//         duration: "",
//       });
//     }
//   });

//   return medicines;
// };


import { matchMedicineName } from "./matchMedicineName";

export function parseMedicines(text) {
  if (!text) return [];

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 3);

  const medicines = [];

  lines.forEach((line) => {
    const lower = line.toLowerCase();

    // ❌ ignore junk
    if (
      lower.includes("doctor") ||
      lower.includes("patient") ||
      lower.includes("date")
    ) {
      return;
    }

    // --- dosage ---
    const dosageMatch =
      line.match(/\b\d-\d-\d\b/) ||
      line.match(/\bOD\b|\bBD\b|\bTDS\b/i);

    // --- duration ---
    const durationMatch = line.match(/\b\d+\s*(days|day|weeks|week)\b/i);

    // --- rough name ---
    let rawName = line;
    if (dosageMatch) rawName = rawName.replace(dosageMatch[0], "");
    if (durationMatch) rawName = rawName.replace(durationMatch[0], "");

    rawName = rawName
      .replace(/tab|tablet|cap|capsule|mg|ml/gi, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim();

    if (rawName.length < 3) return;

    // 🧠 PRESET MATCH HERE
    const finalName = matchMedicineName(rawName);

    medicines.push({
      name: finalName,
      dosage: dosageMatch ? dosageMatch[0] : "",
      duration: durationMatch ? durationMatch[0] : "",
    });
  });

  return medicines;
}
