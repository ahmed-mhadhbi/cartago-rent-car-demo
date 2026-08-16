import type { PickupLocation, RentalOption } from "../types/booking";

// Demonstration extras — availability must be confirmed by the agency.
export const demoRentalOptions: RentalOption[] = [
  { id: "baby-seat", label: { fr: "Siège bébé", en: "Baby seat" }, description: { fr: "Tarif fixe indicatif", en: "Indicative fixed price" }, price: 20, icon: "baby" },
  { id: "extra-driver", label: { fr: "Conducteur supplémentaire", en: "Additional driver" }, description: { fr: "Sur demande", en: "On request" }, price: null, icon: "driver" },
  { id: "delivery", label: { fr: "Livraison", en: "Delivery" }, description: { fr: "Selon le lieu", en: "Depending on location" }, price: null, icon: "delivery" },
  { id: "different-return", label: { fr: "Retour à une autre adresse", en: "Different return address" }, description: { fr: "Sur demande", en: "On request" }, price: null, icon: "route" },
];

export const pickupLocations: PickupLocation[] = [
  { id: "agency", label: { fr: "Agence Mahdia", en: "Mahdia agency" } },
  { id: "hotel", label: { fr: "Hôtel à Mahdia", en: "Hotel in Mahdia" } },
  { id: "custom", label: { fr: "Adresse personnalisée", en: "Custom address" } },
  { id: "monastir", label: { fr: "Aéroport Monastir", en: "Monastir Airport" } },
  { id: "enfidha", label: { fr: "Aéroport Enfidha", en: "Enfidha Airport" } },
  { id: "tunis", label: { fr: "Aéroport Tunis-Carthage", en: "Tunis–Carthage Airport" } },
];
