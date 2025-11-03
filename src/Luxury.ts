export interface Luxury {
  level: number;
  name: string;
  description: string;
  workPerTile: number;
  costPerTile: number;
}

export const PoorLuxury: Luxury = {
  // this is the base level of every construct
  level: 0,
  name: "Modest",
  description: "Bad.",
  workPerTile: 0,
  costPerTile: 0,
};

export const ModestLuxury: Luxury = {
  level: 1,
  name: "Modest",
  description: "Not bad, not great.",
  workPerTile: 2,
  costPerTile: 0.5,
};