import { createClient } from "./client";

export type UploadBucket = "product-images" | "product-models" | "gallery";

/**
 * Uploads a file to the given public bucket and returns its public URL.
 * Requires the current user to be logged in as staff — see the
 * "staff write ..." storage policies in supabase/schema.sql.
 */
export async function uploadFile(bucket: UploadBucket, file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
