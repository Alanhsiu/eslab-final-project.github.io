import { create } from "zustand";

const useSetting = create((set) => ({
  handedness: "left",
  mode: "medium",
  setHandedness: (handedness) => set(() => ({ handedness: handedness })),
  setMode: (mode) => set(() => ({ mode: mode })),
}));
export default useSetting;
