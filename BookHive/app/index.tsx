import { useEffect } from 'react';
import { useRouter, useNavigationContainerRef } from 'expo-router';
import { useRootNavigationState } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState(); // 👈 tracks when layout is ready

  useEffect(() => {
    if (!rootNavigationState?.key) return; // 👈 wait until it's mounted

    // Once layout is ready, do the redirect
    router.replace('/splash');
  }, [rootNavigationState]);

  return null;
}
