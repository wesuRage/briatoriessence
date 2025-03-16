import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../../prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { pedido: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { pedido } = await params;

    const data = await prisma.pedido.findFirst({
      where: { id: pedido },
    });

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { pedido: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { pedido } = await params;
    const { codigoRastreio } = await req.json();

    const data = await prisma.pedido.update({
      where: { id: pedido },
      data: { codigoRastreio },
    });

    return NextResponse.json({ status: "success", data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}
