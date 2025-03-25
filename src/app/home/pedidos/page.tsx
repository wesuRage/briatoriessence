"use client";

import Main from "@/components/Main";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<any>();

  useEffect(() => {
    axios
      .get(`/api/pedidos`)
      .then((response) => setPedidos(response.data.data));
  }, []);

  if (!pedidos) return <h1>Carregando...</h1>;

  return (
    <Main>
      <section>
        {pedidos &&
          pedidos.map((pedido: any, pedido_index: number) => (
            <section key={pedido_index}>
              <h1 className="line-clamp-3">
                {pedido.produtos &&
                  pedido.produtos.map((produto: any, produto_index: number) => (
                    <>
                      <span key={produto_index}>{produto.nome}</span>,
                    </>
                  ))}
              </h1>
            </section>
          ))}
      </section>
    </Main>
  );
}
