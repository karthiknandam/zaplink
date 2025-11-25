import axios, { AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: "/api",
});

export async function getUrldata(
  data: string
): Promise<AxiosResponse<any, any, {}>> {
  const res = await api.get(`/links/${data}`);
  return res;
}
