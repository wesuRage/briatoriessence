import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
  options: { timeout: 5000 },
});

export async function POST(req: Request) {
  try {
    const { resource, topic } = await req.json();

    if (topic != "payment") {
        return NextResponse.json({ status: "error", data: "Forbidden" }, { status: 403 });
    }
    const paymentId = resource;

    const payment = new Payment(client);
    const response = await payment.get({ id: paymentId });
    const status = response.api_response.status;

    // Atualize o status do pagamento no seu banco de dados aqui
    console.log(`Pagamento ${paymentId} atualizado para: ${status}`);
    console.log(`Pagamento recebido!`);

    return NextResponse.json({ status: "success", data: "Received" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
