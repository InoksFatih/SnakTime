// utils/saveToFile.ts
import * as FileSystem from "expo-file-system";

export const saveUserToJsonFile = async (email: string, password: string) => {
  try {
    const fileUri = `${FileSystem.documentDirectory}auth-logins.json`;

    const content = JSON.stringify({ email, password }, null, 2);
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log("✅ Saved user credentials to file:", fileUri);
    return fileUri;
  } catch (error) {
    console.error("❌ Error saving credentials file:", error);
  }
};
