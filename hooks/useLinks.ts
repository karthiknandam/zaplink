"use client";
import { getAllUrls, getUrl } from "@/lib/api";
import { linkType } from "@/lib/validation/link.schema";
import { QueryClient, useQuery } from "@tanstack/react-query";

const fetchLinks = async (): Promise<linkType[] | null> => {
  try {
    const data = await getAllUrls();
    return data.data.links;
  } catch (error) {
    throw new Error(error as string);
  }
};

const fetchUrl = async (code: string) => {
  const res = await getUrl(code);
  if (!res.data.success) throw new Error("Not found");

  return res.data;
};

const useLinks = (limit?: number) => {
  return useQuery({
    queryKey: ["links"],
    queryFn: async () => await fetchLinks(),

    staleTime: 1000 * 60, // 1 minute → data stays
    gcTime: 1000 * 60, /// we can cache this for a minute

    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
};

const useUrl = (code: string) => {
  return useQuery({
    queryKey: ["url", code],
    queryFn: () => fetchUrl(code),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60,

    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });
};

const addNewLink = (newLink: linkType, queryClient: QueryClient) => {
  queryClient.setQueryData<linkType[]>(["links"], (old) => {
    if (!old) return [newLink];
    return [...old, newLink];
  });
};

const removeLink = (code: string, queryClient: QueryClient) => {
  queryClient.setQueryData<linkType[]>(["links"], (old) => {
    return old?.filter((item) => item.code !== code);
  });
};

export { useLinks, fetchLinks, addNewLink, removeLink, useUrl };
