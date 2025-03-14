import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment, PaymentMethod } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
  options: { timeout: 5000 },
});

export async function POST(req: Request) {
  const { transaction_amount, description, payment_method_id, payer } =
    await req.json();

  const payment = new Payment(client);

  switch (payment_method_id) {
    case "pix": {
      const body = {
        transaction_amount,
        description,
        payment_method_id,
        payer,
        notification_url:
          "https://briatoriessence.com.br/api/webhook/mercadopago",
      };

      const generateIdempotencyKey = () =>
        `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

      const requestOptions = {
        idempotencyKey: generateIdempotencyKey(),
      };

      let result;
      await payment
        .create({ body, requestOptions })
        .then((response) => (result = response));
      return NextResponse.json({ data: result }, { status: 200 });
    }
  }
}
