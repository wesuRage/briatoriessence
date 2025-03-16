import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import axios from "axios";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
  options: { timeout: 5000 },
});

export async function POST(req: Request) {
  try {
    const { data, type } = await req.json();

    if (type != "payment") {
      console.log(type);
      return NextResponse.json(
        { status: "error", data: "Forbidden" },
        { status: 403 }
      );
    }
    const paymentId = data.id;

    const payment = new Payment(client);
    const response = await payment.get({ id: paymentId });

    if (response.status === "approved") {
      await axios.patch(
        `${process.env.MERCADO_PAGO_URL}/api/pedidos`,
        { status: "pago", payment_id: paymentId },
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.json(
      { status: "success", data: "Received" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
