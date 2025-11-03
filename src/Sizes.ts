import { ModestLuxury, type Luxury } from "./Luxury"

export interface SizeCategory {
  name: string;
  tiles: number;
  maxLuxury: Luxury;
}

export const SmallSize: SizeCategory = {
  name: "Small",
  tiles: 8,
  maxLuxury: ModestLuxury,
}