import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { AXIOS_BASE_URL } from "@env";

export async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        return result.assets[0].uri;
    }
}

export async function uploadImage(fileUri: string) {
    try {
        const response = await FileSystem.uploadAsync(`${AXIOS_BASE_URL}/users/pfp`, fileUri, {
            fieldName: "profilePicture",
            httpMethod: "POST",
            headers: {
                "Authorization": axios.defaults.headers.common["Authorization"]?.toString() ?? "",
                "Content-Type": "image/jpeg",  // Need to add recognition of file type
            },
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        });

        console.log(JSON.stringify(response, null, 4));
    } catch (error) {
        console.log(error)
    }
}