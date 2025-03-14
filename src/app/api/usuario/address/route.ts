import prisma from "../../../../../prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, rua, numero, complemento, bairro, cidade, estado, cep } =
      await req.json();

    if (!userId || !rua || !numero || !bairro || !cidade || !estado || !cep) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    // Usar upsert para criar ou atualizar o endereço
    const addressOperation = await prisma.address.upsert({
      where: { userId },
      update: {
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
      },
      create: {
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        user: { connect: { id: userId } }
      }
    });

    return NextResponse.json(addressOperation, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao processar endereço" },
      { status: 500 }
    );
  }
}
