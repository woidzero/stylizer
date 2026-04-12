import { __CHANGELOG__ } from "../generated/meta";

export const parsePx = (value: string | number): number => {
  if (typeof value === "number") return value;
  return parseInt(value.replace("px", ""), 10) || 0;
};

export const toPx = (value: number): string => `${value}px`;

export const showChangelog = (): void => {
  Spicetify.PopupModal.display({
    title: "[Stylizer] Changelog",
    content: __CHANGELOG__,
    isLarge: true,
  });
};