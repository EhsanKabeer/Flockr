import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const path = `avatars/${userId}/${Date.now()}_${file.name}`;
  return uploadImage(file, path);
};

export const uploadTweetImage = async (tweetId: string, file: File): Promise<string> => {
  const path = `tweets/${tweetId}/${Date.now()}_${file.name}`;
  return uploadImage(file, path);
};

export const deleteImage = async (url: string): Promise<void> => {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

