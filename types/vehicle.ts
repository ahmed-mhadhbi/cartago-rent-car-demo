export type VehicleCategory = "Citadine" | "Économique" | "Berline" | "SUV";
export type Transmission = "Manuelle" | "Automatique";

export interface Vehicle {
  id: string;
  name: string;
  category: VehicleCategory;
  transmission: Transmission;
  fuel: "Essence" | "Diesel";
  seats: number;
  bags: number;
  airConditioning: boolean;
  dailyRate: number;
  images: string[];
  availability: "available" | "limited";
  featured: boolean;
  description: string;
}
