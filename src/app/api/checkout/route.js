import mercadopago from "mercadopago";
import { NextResponse } from "next/server";

mercadopago.configure({
  access_token: process.env.NEXT_ACCESS_TOKEN,
});

export async function POST(request) {
  const data = await request.json();

  const URL ="https://6968-191-98-182-182.ngrok-free.app"; //ojo cambiar al url que me da el  serv

  try {
    const preference = {
      items: data.carrito.map((product) => ({
        title: product.name,
        unit_price: product.price,
        quantity: 1,
      })),
      auto_return: "approved",
      back_urls: {
        success: `${URL}`,
        failure: `${URL}`,
      },
    };
    const response = await mercadopago.preferences.create(preference);
    return NextResponse.json({ url: response.body.init_point });
  } catch (error) {
    NextResponse.error(error);
  }
}
