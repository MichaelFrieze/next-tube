import { useQuery } from "@tanstack/react-query";

const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("Content-Type");
    return response.ok && !!contentType?.startsWith("image");
  } catch {
    return false;
  }
};

export function useImageUrlValidation(
  imageUrl: string | null | undefined,
  fallbackUrl: string,
): string {
  const { data: validatedUrl } = useQuery({
    queryKey: ["imageUrlValidation", imageUrl],
    queryFn: async () => {
      if (!imageUrl || !(await validateImageUrl(imageUrl))) {
        return fallbackUrl;
      }
      return imageUrl;
    },
    staleTime: 0,
    gcTime: 0,
  });

  return validatedUrl ?? fallbackUrl;
}
