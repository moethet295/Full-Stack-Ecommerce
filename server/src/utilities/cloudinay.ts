import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: ".env" });

const cloudName = process.env.CLOUINARY_CLOUD_NAME;
const apiKey = process.env.CLOUINARY_API_KEY;
const apiSecret = process.env.CLOUINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are missing");
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

export const uploadSingleImage = async (
    image: string,
    folder_name: string) => {
    const response = await cloudinary.uploader.upload(image, {
        folder: folder_name,
    });

    return {
        image_url: response.secure_url,
        public_alt: response.public_id,
    };
};

export const deleteImage = async(public_alt: string) => {
    const res = await cloudinary.uploader.destroy(public_alt);

    return res?.result === "ok";
}