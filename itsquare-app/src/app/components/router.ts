"use client";
import { useRouter } from "next/navigation";

export function useDelayedRedirect(delay: number = 2000) {
  const router = useRouter();

  function delayedPush(url: string) {
    setTimeout(() => {
      router.push(url);
    }, delay);
  }

  return { delayedPush };
}
