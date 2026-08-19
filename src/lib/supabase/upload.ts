import { createClient } from "./client";

export type UploadBucket = "product-images" | "product-models" | "gallery";

const EXTENSION_MIME_TYPES: Record<string, string> = {
  glb: "model/gltf-binary",
  gltf: "model/gltf+json",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
};

/**
 * Uploads a file to the given public bucket and returns its public URL.
 * Requires the current user to be logged in as staff — see the
 * "staff write ..." storage policies in supabase/schema.sql.
 */
export async function uploadFile(bucket: UploadBucket, file: File): Promise<string> {
  const supabase = createClient();
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;

  // Browsers frequently report an empty or wrong file.type for formats
  // like .glb (no registered OS/browser MIME mapping) — that empty string
  // then fails the bucket's allowed_mime_types check regardless of who's
  // uploading. Resolve the type from the extension instead of trusting
  // file.type when it's missing or generic.
  const contentType =
  (file.type && file.type !== "application/octet-stream")
    ? file.type
    : (EXTENSION_MIME_TYPES[ext] ?? file.type ?? "application/octet-stream");

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
