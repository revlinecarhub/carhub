"use client";

import { useEffect, useRef } from "react";
import { trackViewAction } from "@/app/views/actions";

export function ViewTracker({ carId }: { carId: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackViewAction(carId).catch(() => {});
  }, [carId]);
  return null;
}
