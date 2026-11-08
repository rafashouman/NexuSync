export const salonServices = [
  { name: "Corte de cabelo", detail: "Lavagem, corte e finalização", minutes: 45, price: 65 },
  { name: "Barba na toalha quente", detail: "Desenho, navalha e hidratação", minutes: 30, price: 40 },
  { name: "Escova e finalização", detail: "Lavagem e modelagem dos fios", minutes: 60, price: 85 },
  { name: "Corte e barba", detail: "Atendimento completo na mesma visita", minutes: 75, price: 95 },
] as const;

export const salonHours = ["09:00", "10:30", "14:00", "15:30", "17:00"] as const;

export function salonToday() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

export function futureSalonSlot(date: string, hour: string) {
  return new Date(`${date}T${hour}:00-03:00`).getTime() > Date.now();
}
