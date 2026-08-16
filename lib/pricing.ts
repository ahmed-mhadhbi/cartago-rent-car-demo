import type { Quote, RentalOption } from "../types/booking";
import type { Vehicle } from "../types/vehicle";

const DAY_MS = 86_400_000;

export function calculateRentalDays(pickupDate: string, returnDate: string): number {
  if (!pickupDate || !returnDate) return 0;
  const start = new Date(`${pickupDate}T00:00:00Z`).getTime();
  const end = new Date(`${returnDate}T00:00:00Z`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.ceil((end - start) / DAY_MS);
}

export function calculateQuote(
  pickupDate: string,
  returnDate: string,
  vehicle: Vehicle | null,
  selectedOptionIds: string[],
  options: RentalOption[],
): Quote {
  const rentalDays = calculateRentalDays(pickupDate, returnDate);
  const rentalSubtotal = vehicle ? rentalDays * vehicle.dailyRate : 0;
  const extrasTotal = options
    .filter((option) => selectedOptionIds.includes(option.id))
    .reduce((sum, option) => sum + (option.price ?? 0), 0);
  return { rentalDays, rentalSubtotal, extrasTotal, total: rentalSubtotal + extrasTotal };
}

export function validateDateRange(pickupDate: string, returnDate: string): string | null {
  if (!pickupDate || !returnDate) return "Veuillez sélectionner les deux dates.";
  if (calculateRentalDays(pickupDate, returnDate) < 1) return "La date de retour doit être après la date de départ.";
  return null;
}
