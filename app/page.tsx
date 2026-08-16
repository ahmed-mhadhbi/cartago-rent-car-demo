import { CartagoSite } from "../components/CartagoSite";
import { BookingProvider } from "../context/BookingContext";

export default function Home() {
  return <BookingProvider><CartagoSite /></BookingProvider>;
}
