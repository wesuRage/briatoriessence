"use client";

import Main from "@/components/Main";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Produto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [pedido, setPedido] = useState<any>();

  useEffect(() => {
    params.then(async (resolvedParams) => {
      await axios
        .get(`/api/pedidos/${resolvedParams.id}`)
        .then((response) => setPedido(response.data.data));
    });
  }, [params]);

  if (!pedido) return <h1>Carregando...</h1>

  return (
    <Main>
        <section className="container w-full rounded-md bg-white border border-gray-300">
            <h1>cu</h1>
        </section>
    </Main>
  )
}
