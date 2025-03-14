// API /api/pedidos (POST)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import prisma from "../../../../prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const {
      produtos,
      frete,
      tipoFrete,
      total,
      endereco,
      status,
      meioPagamento,
      pagamentoId
    } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cart: true },
    });

    if (!user)
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );

    // Criar pedido
    const pedido = await prisma.pedido.create({
      data: {
        userId: user.id,
        produtos: {
          create: produtos.map((p: any) => ({
            produtoId: p.produtoId,
            quantidade: p.quantidade,
            preco: p.produto.precoDes || p.produto.precoOrg,
          })),
        },
        frete,
        tipoFrete,
        valorTotal: total,
        valorFrete: frete,
        totalProdutos: produtos.reduce(
          (acc: number, p: any) => acc + p.quantidade,
          0
        ),
        nomeDestinatario: endereco.nome,
        meioPagamento,
        pagamentoId,
        status,
      },
    });

    return NextResponse.json(pedido);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    return NextResponse.json(await prisma.pedido.findMany());
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}
