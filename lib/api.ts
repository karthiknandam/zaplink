import axios, { AxiosResponse } from "axios";
import { linkType } from "./validation/link.schema";
import { Expiry } from "@/components/dashboard/Create";

export type createCodeType = {
  url: string;
  code?: string;
  expiry?: Expiry;
  // We can ensute the exipration
};

const api = axios.create({
  baseURL: "/api",
});
const getAllUrls = async (
  page?: number
): Promise<AxiosResponse<{ links: linkType[] }>> => {
  const res = await api.get<{ links: linkType[] }>("/links");
  return res;
};

const getUrl = async (code: string): Promise<AxiosResponse<any, any, {}>> => {
  const res = await api.get<{ links: linkType[] }>(`/links/${code}`);
  return res;
};

interface CreateCodeResponse {
  success: boolean;
  error?: any;
  data?: linkType;
  message?: string;
}

const createCode = async (
  payload: createCodeType
): Promise<CreateCodeResponse> => {
  try {
    const response = await fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: payload.url,
        code: payload.code,
      }),
    });
    return response.json();
    // return response; // only return data, not full AxiosResponse
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Failed to create link");
  }
};

const deleteCode = async (
  code: string
): Promise<AxiosResponse<any, any, {}>> => {
  const response = await api.delete(`/links/${code}`);
  return response;
};

export { api, getAllUrls, createCode, deleteCode, getUrl };
