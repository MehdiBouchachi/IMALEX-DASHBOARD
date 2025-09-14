import { useMemo } from "react";
import { fakeUsers } from "../../data/fakeUsers";

export function useProfile(id) {
  const profile = useMemo(
    () => fakeUsers.find((u) => u.id === id) || null,
    [id]
  );
  return { profile, isLoading: false };
}
