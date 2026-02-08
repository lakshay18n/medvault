import { supabase } from "../superbaseClient";

export const uploadPrescriptionImage = async (file, userId) => {
  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("prescriptions")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("prescriptions")
    .getPublicUrl(filePath);

  return data.publicUrl;
};
