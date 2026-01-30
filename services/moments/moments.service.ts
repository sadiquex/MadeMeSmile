import { Moment } from "@/types";

export interface CreateMomentData {
  content: string;
  mediaType: "photo" | "video" | "audio" | "text";
  mediaUrl?: string;
  category: string;
  collection?: string;
  tags: string[];
  mood?: "happy" | "grateful" | "excited" | "peaceful";
}

const NOT_IMPLEMENTED =
  "Moments API not configured. Integrate REST API in services/moments/moments.service.ts (e.g. api.get('/moments'), api.post('/moments'), api.delete('/moments/:id')).";

export async function addMoment(momentData: CreateMomentData): Promise<void> {
  // TODO: Replace with REST API call, e.g. api.post("/moments", momentData)
  throw new Error(NOT_IMPLEMENTED);
}

export async function getMoments(): Promise<Moment[]> {
  // TODO: Replace with REST API call, e.g. api.get("/moments")
  return [];
}

export async function getMomentsByCategory(
  _category: string,
): Promise<Moment[]> {
  // TODO: Replace with REST API call, e.g. api.get("/moments", { params: { category } })
  return [];
}

export async function deleteMoment(_momentId: string): Promise<void> {
  // TODO: Replace with REST API call, e.g. api.delete(`/moments/${momentId}`)
  throw new Error(NOT_IMPLEMENTED);
}
