import type { Booking, PickupLocation, Quote, RentalOption } from "../types/booking";

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

const formatDate = (value: string) => {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

export function buildBookingMessage(
  booking: Booking,
  quote: Quote,
  options: RentalOption[],
  locations: PickupLocation[],
): string {
  const selectedExtras = options.filter((option) => booking.selectedOptions.includes(option.id));
  const location = locations.find((item) => item.id === booking.pickupLocation)?.label.fr ?? "Mahdia";
  const extras = selectedExtras.length ? selectedExtras.map((item) => `• ${item.label.fr}`).join("\n") : "• Aucune option";

  return [
    "Bonjour Cartago Rent Car 👋",
    "",
    "Je souhaite faire une demande de réservation.",
    "",
    `🚗 Véhicule : ${booking.selectedVehicle?.name ?? "À confirmer"}`,
    `📅 Départ : ${formatDate(booking.pickupDate)} à ${booking.pickupTime}`,
    `📅 Retour : ${formatDate(booking.returnDate)} à ${booking.returnTime}`,
    `⏱️ Durée : ${quote.rentalDays} jour${quote.rentalDays > 1 ? "s" : ""}`,
    `📍 Lieu : ${location}${booking.customAddress ? ` — ${booking.customAddress}` : ""}`,
    "",
    "Options :",
    extras,
    "",
    `💰 Estimation : ${quote.total} DT`,
    "",
    "Client :",
    `${booking.customer.firstName} ${booking.customer.lastName}`.trim(),
    booking.customer.phone,
    booking.customer.email || "",
    booking.customer.message ? `Message : ${booking.customer.message}` : "",
    "",
    "Pouvez-vous me confirmer la disponibilité et le tarif final ?",
  ].filter((line, index, all) => line !== "" || all[index - 1] !== "").join("\n");
}
