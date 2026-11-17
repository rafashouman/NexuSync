import { getPromoSlots } from "@/app/actions/promoSlots";

export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  try {
    return Response.json(await getPromoSlots(), { headers });
  } catch (error) {
    console.warn("Consulta de vagas promocionais indisponível.", error);
    return Response.json(null, { status: 503, headers });
  }
}
