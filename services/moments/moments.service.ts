import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import {
  CreateMomentRequest,
  CreateMomentResponse,
  GetMomentByIdResponse,
  GetMomentsResponse,
} from "./moments.types";

function getMimeType(mediaType: string): string {
  if (mediaType === "photo" || mediaType.includes("image")) return "image/jpeg";
  if (mediaType === "video" || mediaType.includes("video")) return "video/mp4";
  if (mediaType === "audio" || mediaType.includes("audio")) return "audio/mpeg";
  return "application/octet-stream";
}

export async function addMoment(
  momentData: CreateMomentRequest,
): Promise<CreateMomentResponse> {
  try {
    const formData = new FormData();
    const media = momentData.media as {
      uri?: string;
      type?: string;
      name?: string;
    };
    formData.append("media", {
      uri: media.uri,
      type: getMimeType(media.type ?? "photo"),
      name: media.name ?? `moment_${Date.now()}.jpg`,
    } as any);
    formData.append("description", momentData.description);
    formData.append("feeling", momentData.feeling);
    formData.append("collection", momentData.collection);
    const response = await api.post<CreateMomentResponse>("/moments", formData);
    console.log(
      "🚀 ~ addMoment ~ response:",
      JSON.stringify(response.data, null, 2),
    );
    return response.data;
  } catch (error) {
    // console.error("Error adding moment:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function getMoments(): Promise<GetMomentsResponse> {
  try {
    const response = await api.get<GetMomentsResponse>("/moments");
    return response.data;
  } catch (error) {
    // console.error("Error fetching moments:", error);
    throw new Error(getErrorMessage(error));
  }
}

// export async function getMomentsByCategory(
//   _category: string,
// ): Promise<Moment[]> {
//   // TODO: Replace with REST API call, e.g. api.get("/moments", { params: { category } })
//   return [];
// }

export async function deleteMoment(momentId: string): Promise<void> {
  try {
    await api.delete(`/moments/${momentId}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

// {{baseURL}}/api/v1/moments/f57c5074-78d6-485a-9c0b-1cc7b7858374
export async function getMomentById(
  id: string,
): Promise<GetMomentByIdResponse> {
  try {
    const response = await api.get<GetMomentByIdResponse>(`/moments/${id}`);
    return response.data;
  } catch (error) {
    // console.error("Error fetching moment by id:", error);
    throw new Error(getErrorMessage(error));
  }
}
