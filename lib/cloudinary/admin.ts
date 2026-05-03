import { v2 as cloudinary } from "cloudinary";

let configured = false;
function configure() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export async function destroyImages(publicIds: string[]): Promise<void> {
  if (publicIds.length === 0) return;
  configure();
  await Promise.all(
    publicIds.map((id) => cloudinary.uploader.destroy(id))
  );
}

export async function destroyVideo(publicId: string | null): Promise<void> {
  if (!publicId) return;
  configure();
  await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
}
