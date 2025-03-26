"use client";

import Main from "@/components/Main";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { FaPix } from "react-icons/fa6";
import { notFound } from 'next/navigation'

export default function Pedido({
  params,
}: {
  params: Promise<{ pedido: string }>;
}) {
  const [pedido, setPedido] = useState<any>();

  useEffect(() => {
    if (!params) return;
    params.then(async (resolvedParams) => {
      await axios
        .get(`/api/pedidos/${resolvedParams.pedido}`)
        .then((response) => setPedido(response.data.data));
    });
  }, [params]);

  if (!pedido) notFound();

  return (
    <Main>
      <section className="flex justify-center">
        <div className="grid grid-cols-1">
          <h2 className="text-center text-2xl mb-4">
            {new Date(pedido.updatedAt).toLocaleString()}
          </h2>
          {pedido && (
            <section className="min-w-[600px] container bg-white p-2 my-2 shadow-md border border-gray-400 rounded-md">
              {pedido.produtos.map((produtoPedido: any) => (
                <section
                  key={produtoPedido.produto.id}
                  className="flex py-3 border-b-2 border-gray-400 last:border-b-0"
                >
                  <div className="relative w-[100px] h-[100px]">
                    <Image
                      src={produtoPedido.produto.imagens[0]}
                      alt={produtoPedido.produto.nome}
                      layout="fill"
                      quality={100}
                      objectFit="cover"
                      loading="lazy"
                      className="select-none rounded-md max-h-[250px] max-w-[250px]"
                    />
                  </div>
                  <div className="px-2 flex-1">
                    <h3 className="text-2xl font-semibold">
                      {produtoPedido.produto.nome}
                    </h3>
                    <p className="text-lg text-gray-700">
                      Quantidade: {produtoPedido.quantidade}
                    </p>
                    <p className="text-lg text-gray-700">
                      Preço unitário: R$
                      {produtoPedido.produto.precoOrg.toFixed(2)}
                    </p>
                    <p className="text-lg text-gray-700">
                      Subtotal: R$
                      {(
                        produtoPedido.quantidade *
                        produtoPedido.produto.precoOrg
                      ).toFixed(2)}
                    </p>
                  </div>
                </section>
              ))}
              <div>
                
              </div>

              <div className="mt-4">
                <h3 className="text-xl my-1 text-gray-700">
                  Frete: R${pedido.valorFrete.toFixed(2)} ({pedido.tipoFrete})
                </h3>
                <h3 className="text-xl text-gray-700">
                  Preço total: R${pedido.valorTotal.toFixed(2)}{" "}
                  {pedido.meioPagamento == "pix" ? "(5% OFF)" : ""}
                </h3>
                <h3 className="text-xl text-gray-700 flex items-center gap-1">
                  Status do pagamento:{" "}
                  <span className="bg-[var(--primary)] p-1 rounded-md text-black">
                    {pedido.status}
                  </span>{" "}
                  <span className="flex items-center">
                    (
                    {pedido.meioPagamento == "pix" ? (
                      <FaPix />
                    ) : (
                      <FaCreditCard />
                    )}{" "}
                    {String(pedido.meioPagamento).toUpperCase()})
                  </span>
                </h3>
              </div>
            </section>
          )}
        </div>
      </section>
    </Main>
  );
}
