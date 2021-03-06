import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import fs from "fs";
import { log } from "./Helpers";

const storage = new Storage({
  keyFilename: "./serviceAccountKey.json",
  projectId: "telerank-e9b37",
});

const bucket = storage.bucket("telerank-e9b37.appspot.com");

/* Upload an image to a Google Cloud Storage bucket, by default it will resize and optimize the image before uploading it.
 * the file will be uploaded as username.jpg
 * Returns the public url
 */
export async function uploadPhoto(
  photoBytes: Uint8Array,
  username: string,
  optimize = true
): Promise<string | undefined> {
  try {
    const PATH = `${username}.jpg`;
    if (optimize) {
      // Resize with sharp
      const width = 400;
      const height = 400;
      const buffer = await sharp(Buffer.from(photoBytes))
        .resize(width, height)
        .jpeg()
        .toBuffer();
      await sharp(buffer).toFile(PATH);

      // Optimize with imagemin/mozjpeg
      await imagemin([PATH], {
        plugins: [imageminMozjpeg({ quality: 80 })],
        destination: "./",
      });
    }

    // Upload file
    const uploadResults = await bucket.upload(PATH, { gzip: true });

    // Delete local file
    fs.unlink(PATH, (err) => err && log.error(`Delete file failed: ${err}`));

    // Return public url
    return uploadResults[0].publicUrl();
  } catch (err) {
    log.error(err);
    return undefined;
  }
}

// Lists all buckets in the current project
export async function listBuckets() {
  try {
    const [buckets] = await storage.getBuckets();
    log.info("Buckets:");
    buckets.forEach((b) => {
      log.info(b.name);
    });
  } catch (err) {
    log.error(err);
  }
}
