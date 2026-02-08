import { useState } from "react";
import { supabase } from "../superbaseClient";
import { uploadPrescriptionImage } from "../utils/uploadImage";
import { runBrowserOCR } from "../utils/browserOcr";
import { parseMedicines } from "../utils/parseMedicines";

function ScanPrescription() {
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ocrText, setOcrText] = useState("");
    const [parsedMeds, setParsedMeds] = useState([]);
    const [isScanned, setIsScanned] = useState(false); // 🔥 important

    /* ---------------- IMAGE UPLOAD ---------------- */
    const handleImageUpload = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setImage(URL.createObjectURL(selected));
            setOcrText("");
            setParsedMeds([]);
            setIsScanned(false);
        }
    };

    /* ---------------- OCR ONLY (NO SAVE) ---------------- */
    const handleScanPrescription = async () => {
        if (!file) {
            alert("Please upload an image first");
            return;
        }

        try {
            setLoading(true);
            setOcrText("⏳ Reading prescription, please wait...");

            const ocrResult = await runBrowserOCR(file);
            setOcrText(ocrResult);

            const extractedMedicines = parseMedicines(ocrResult);
            setParsedMeds(extractedMedicines);
            setIsScanned(true);
        } catch (err) {
            console.error(err);
            alert("Failed to scan prescription");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- MEDICINE EDIT ---------------- */
    const handleMedicineChange = (index, field, value) => {
        const updated = [...parsedMeds];
        updated[index][field] = value;
        setParsedMeds(updated);
    };

    const handleRemoveMedicine = (index) => {
        setParsedMeds(parsedMeds.filter((_, i) => i !== index));
    };

    const handleAddMedicine = () => {
        setParsedMeds([
            ...parsedMeds,
            { name: "", dosage: "", duration: "" },
        ]);
    };

    /* ---------------- FINAL SAVE (ONLY ONCE) ---------------- */
    const handleSavePrescription = async () => {
        try {
            setLoading(true);

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user || !file) {
                alert("User or file missing");
                return;
            }

            if (!isScanned) {
                alert("Please scan prescription first");
                return;
            }
            // FINAL medicines list (OCR + Manual + Edited)
            const validMedicines = parsedMeds.filter(
                (med) => med.name && med.name.trim() !== ""
            );

            if (validMedicines.length === 0) {
                alert("Please add at least one medicine");
                return;
            }

            // Upload image
            const imageUrl = await uploadPrescriptionImage(file, user.id);

            // Insert prescription
            const { data: prescription, error: pError } = await supabase
                .from("prescriptions")
                .insert({
                    user_id: user.id,
                    image_url: imageUrl,
                })
                .select()
                .single();

            if (pError) throw pError;

            // Insert medicines
            const medicinesData = validMedicines.map((med) => ({
                prescription_id: prescription.id,
                name: med.name,
                dosage: med.dosage || "",
                duration: med.duration || "",
            }));
            console.log("FINAL MEDICINES TO SAVE:", medicinesData);

            const { error: mError } = await supabase
                .from("medicines")
                .insert(medicinesData);

            if (mError) throw mError;

            alert("Prescription saved successfully!");
            setIsScanned(false);
        } catch (err) {
            console.error(err);
            alert(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        * { box-sizing: border-box; }
        body { font-family: Segoe UI, sans-serif; background:#f4f6ff; }

        .container { max-width:1100px; margin:auto; padding:50px; }
        h1 { text-align:center; color:#4f46e5; }
        .subtitle { text-align:center; color:#555; margin-bottom:20px; }

        .grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        @media(max-width:768px){ .grid{grid-template-columns:1fr;} }

        .card { background:#fff; border-radius:14px; padding:18px;
          box-shadow:0 10px 25px rgba(0,0,0,0.08); }

        .upload-box { padding:30px; justify-content:center; text-align:center; border-radius:12px; cursor:pointer; }
        .upload-box input{display:none;}
        .upload-box p { font-size:16px; color:#4f46e5; margin:0; }
        .upload-box small { font-size:12px; color:#888; text-align:center; justify-content:center; display:block; margin-top:6px; }

        img{width:100%; border-radius:10px;}

        .med-card{background:#eef2ff; padding:12px; border-radius:10px; margin-top:10px;}
        .med-card input{width:100%; padding:8px; margin-top:6px;
          border-radius:6px; border:1px solid #ccc;}

        .btn{margin-top:16px; width:100%; padding:14px;
          background:#4f46e5; color:#fff; border:none; justify-content:center; align-items:center;
          border-radius:10px; font-size:16px; cursor:pointer;}
        .btn:disabled{opacity:.6; cursor:not-allowed;}
      `}</style>

            <div className="container">
                <h1>Scan Prescription</h1>
                <p className="subtitle">
                    Scan → Edit → Save (no duplicate entries)
                </p>

                <div className="grid">
                    {/* LEFT */}
                    <div className="card">
                        <label className="upload-box">
                            <input type="file" accept="image/*" onChange={handleImageUpload} />

                            <p>📸 Click to upload prescription</p>
                            <small>JPG / PNG supported</small>
                        </label>


                        {image && <img src={image} alt="Prescription" />}
                    </div>

                    {/* RIGHT */}
                    <div className="card">
                        {ocrText && <pre>{ocrText}</pre>}

                        {parsedMeds.length > 0 && (
                            <>
                                <h3>💊 Edit Medicines</h3>

                                <button className="btn" onClick={handleAddMedicine}>
                                    ➕ Add Medicine Manually
                                </button>

                                {parsedMeds.map((med, i) => (
                                    <div className="med-card" key={i}>
                                        <input
                                            value={med.name}
                                            onChange={(e) => handleMedicineChange(i, "name", e.target.value)}
                                            placeholder="Medicine name"
                                        />
                                        <input
                                            value={med.dosage}
                                            onChange={(e) => handleMedicineChange(i, "dosage", e.target.value)}
                                            placeholder="Dosage"
                                        />
                                        <input
                                            value={med.duration}
                                            onChange={(e) => handleMedicineChange(i, "duration", e.target.value)}
                                            placeholder="Duration"
                                        />
                                        <button
                                            onClick={() => handleRemoveMedicine(i)}
                                            style={{
                                                marginTop: 6, background: "#fee2e2",
                                                border: "none", padding: "6px", borderRadius: 6
                                            }}
                                        >
                                            ❌ Remove
                                        </button>
                                    </div>
                                ))}
                            </>
                        )}

                        {!isScanned && (
                            <button className="btn" onClick={handleScanPrescription} disabled={loading}>
                                {loading ? "⏳ Scanning..." : "📄 Scan Prescription"}
                            </button>
                        )}

                        {isScanned && (
                            <button className="btn" onClick={handleSavePrescription} disabled={loading}>
                                💾 Save Prescription
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ScanPrescription;
