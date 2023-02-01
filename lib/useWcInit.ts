import { useCallback, useEffect, useState } from "react";
import { IClubInfo } from "./fetchers";
import { createSignClient } from "./walletConnectLib";

export default function useWcinit(data: IClubInfo) {
  const [initialized, setInitialized] = useState(false);

  const onInit = useCallback(async () => {
    try {
      await createSignClient(data);
      setInitialized(true);
    } catch (err) {
      alert(err);
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      onInit();
    }
  }, [initialized, onInit]);

  return initialized;
}
