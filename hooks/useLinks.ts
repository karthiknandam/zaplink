"use client";
import { getAllUrls } from "@/lib/api";
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

const useLinks = (limit?: number) => {
  return useQuery({
    queryKey: ["links"],
    queryFn: async () => await fetchLinks(),

    staleTime: 1000 * 60 * 1, // 1 minutes → data stays
    gcTime: 1000 * 60 * 1, /// we can cache this for a minute

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

export { useLinks, fetchLinks, addNewLink, removeLink };
