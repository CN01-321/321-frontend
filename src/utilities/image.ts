/**
 * @file Utility functions for uploading and selecting images
 * @author George Bull
 * @author Matthew Kolega
 */

import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Buffer } from "buffer";

export async function pickImage(): Promise<
  ImagePicker.ImagePickerAsset | undefined
> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    base64: true,
    allowsEditing: true,
    aspect: [3, 4],
  });

  if (!result.canceled) {
    return result.assets[0];
  }
}

export async function uploadImage(
  apiEndpoint: string,
  image: ImagePicker.ImagePickerAsset
) {
  const imageBuffer = Buffer.from(image.base64 ?? "", "base64");

  try {
    await axios.post(apiEndpoint, imageBuffer.buffer, {
      headers: {
        "content-type": "image/png",
      },
    });
    console.log("uploaded image");
  } catch (err) {
    console.error(err);
    throw new Error("Could not upload image");
  }
}
