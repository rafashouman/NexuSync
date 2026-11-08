"use client";

import { useEffect, useState } from "react";
import { Scissors, CalendarDays, Check } from "lucide-react";
import { bookAppointment, occupiedSalonHours } from "@/app/actions/bookAppointment";
import { futureSalonSlot, salonHours, salonServices, salonToday } from "@/lib/salon";
import { signInPlayer } from "@/lib/player";

const dateLabel = (date: string) => new Date(date + "T12:00:00").toLocaleDateString("pt-BR");
const control = "rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-950";

export default function ChronosBooking() {
  const [service, choose] = useState<(typeof salonServices)[number]>(salonServices[0]);
  const [date, setDate] = useState("");
  const [firstDate, setFirstDate] = useState("");
  const [hour, setHour] = useState("");
  const [name, setName] = useState("");
  const [agenda, setAgenda] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [availability, setAvailability] = useState<{ date: string; taken: string[] | null }>();
  const [revision, refresh] = useState(0);
  const [receipts, setReceipts] = useState<{ date: string; hour: string; service: string; name: string }[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => { const today = salonToday(); setDate(today); setFirstDate(today); });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!date) return;
    let current = true;
    occupiedSalonHours(date).catch(() => null).then(taken => {
      if (current) setAvailability({ date, taken });
    });
    return () => { current = false; };
  }, [date, revision]);
  const ready = availability?.date === date && Array.isArray(availability.taken);
  const taken = availability?.date === date ? availability.taken ?? [] : [];

  async function confirm(event: React.FormEvent) {
    event.preventDefault();
    if (!hour || busy || !ready) return;
    setBusy(true);
    setMessage("");
    try {
      const player = await signInPlayer(name);
      if (!player) throw new Error();
      const result = await bookAppointment({ venue: "salon", date, timeSlot: hour, serviceName: service.name }, await player.getIdToken());
      if (result.success) {
        setReceipts(prev => [...prev, { date, hour, name: name.trim(), service: service.name }]);
        setMessage(`Reserva confirmada para ${dateLabel(date)}, às ${hour}. Serviço: ${service.name}.`);
      } else setMessage(result.error || "Confira o horário e tente novamente.");
      setHour("");
      refresh(n => n + 1);
    } catch { setMessage("Não foi possível confirmar. Confira seu nome e tente novamente."); }
    finally { setBusy(false); }
  }

  return <section className="overflow-hidden rounded-3xl bg-[#faf6ee] text-stone-900">
    <header className="flex flex-wrap items-center justify-between gap-5 bg-[#293e35] p-6 text-[#fbf3e2] sm:p-10">
      <div><Scissors size={26} /><h2 className="mt-3 font-serif text-4xl">Estúdio Navalha &amp; Fio</h2><p className="mt-2 text-sm">Barbearia e salão · Porto Alegre, RS</p></div>
      <button type="button" disabled={busy} className="rounded-full border border-white/50 px-5 py-3" data-tour="dashboard" onClick={() => setAgenda(!agenda)}>
        {agenda ? "Voltar ao agendamento" : "Ver agenda do salão"}</button>
    </header>
    <form onSubmit={confirm} className="p-5 sm:p-10">
      <fieldset disabled={busy} className="space-y-7">
        {!agenda && <section><h3 className="mb-4 text-xl font-bold">Qual serviço você quer marcar?</h3>
          <div className="grid gap-3 sm:grid-cols-2">{salonServices.map(item =>
            <button type="button" data-tour="service" key={item.name} aria-pressed={item === service} onClick={() => {choose(item); setMessage("");}}
              className={`rounded-xl border p-4 text-left ${item === service ? "border-[#315840] bg-[#e5ecdf]" : "border-stone-300 bg-white"}`}>
              <strong>{item.name}</strong><span className="mt-1 block text-sm">{item.detail}</span><span className="mt-3 block font-bold">R$ {item.price} · {item.minutes} min</span>
            </button>)}</div></section>}
        <label className="block font-bold"><CalendarDays className="mr-2 inline" size={19}/> {agenda ? "Agenda do dia" : "Escolha o dia"}
          <input data-tour="date" className={control + " mt-2 block"} type="date" value={date} min={firstDate} onChange={e => {setDate(e.target.value); setHour(""); setMessage("");}} required /></label>
        <section><h3 className="mb-3 font-bold">{agenda ? "Ocupação do salão" : "Horários disponíveis"} · horário de Brasília</h3>
          {!ready ? <p role="status">{availability?.date === date ? <>Agenda indisponível. <button type="button" className="underline" onClick={() => refresh(n => n + 1)}>Tentar novamente</button></> : "Consultando horários…"}</p>
          : <div className="flex flex-wrap gap-2">{salonHours.map(slot => {
            const occupied = taken.includes(slot);
            const past = !futureSalonSlot(date, slot);
            const receipt = receipts.find(r => r.date === date && r.hour === slot);
            return agenda ? <p key={slot} className={control}><b>{slot}</b> · {receipt ? receipt.name + " · " + receipt.service : occupied ? "Reservado" : past ? "Encerrado" : "Livre"}</p>
              : <button key={slot} type="button" disabled={occupied || past} aria-pressed={hour === slot} onClick={() => {setHour(slot); setMessage("");}}
                className={control + " disabled:opacity-45 aria-pressed:border-green-900 aria-pressed:bg-green-100"}>{slot}{occupied ? " · reservado" : past ? " · encerrado" : ""}</button>;
          })}</div>}</section>
        {!agenda && <div className="flex flex-wrap items-end gap-4"><label className="font-bold">Como podemos chamar você?
          <input required minLength={2} maxLength={24} autoComplete="given-name" className={control + " mt-2 block w-full"} value={name} onChange={e => setName(e.target.value)} /></label>
          <button data-tour="confirm" disabled={!ready || !hour || name.trim().length < 2 || busy} className="rounded-xl bg-[#293e35] px-6 py-3 font-bold text-white disabled:opacity-50">
            <Check size={17} className="mr-2 inline"/>{busy ? "Confirmando…" : "Confirmar horário"}</button></div>}
      </fieldset><p role="status" className="mt-4 font-semibold">{message}</p>
    </form>
  </section>;
}
