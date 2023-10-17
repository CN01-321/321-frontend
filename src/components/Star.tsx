/**
 * @file Wrapper for the star svg
 * @author George Bull
 */

import StarIcon from "../../assets/icons/StarIcon.svg";

interface StarProps {
  size: number;
  colour?: "yellow" | "grey";
}
export default function Star({ size, colour }: StarProps) {
  const hexColour = colour === "grey" ? "#D9D9D9" : "#FFD94F";

  return <StarIcon width={size} height={size} fill={hexColour} />;
}
