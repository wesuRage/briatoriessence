"use client";

import Main from "@/components/Main";
import ProdutoCard from "@/components/ProdutoCard";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Produto {
  id: string;
  nome: string;
  precoOrg: number;
  precoDes: number;
  descricao: string;
  imagens: string[];
  tags: string;
}

export default function Dashboard() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidos, setPedidos] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/api/produtos")
        .then((response) => {
          setProdutos(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar produtos:", error);
          setLoading(false);
        });

      await axios
        .get("/api/pedidos")
        .then((response) => {
          setPedidos(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar pedidos:", error);
          setLoading(false);
        });
    };

    fetchData();
  }, []);

  const sortByNameAsc = () => {
    const sorted = [...produtos].sort((a, b) => a.nome.localeCompare(b.nome));
    setProdutos(sorted);
    setActiveButton("nameAsc");
  };

  const sortByNameDesc = () => {
    const sorted = [...produtos].sort((a, b) => b.nome.localeCompare(a.nome));
    setProdutos(sorted);
    setActiveButton("nameDesc");
  };

  const sortByPriceAsc = () => {
    const sorted = [...produtos].sort((a, b) => a.precoOrg - b.precoOrg);
    setProdutos(sorted);
    setActiveButton("priceAsc");
  };

  const sortByPriceDesc = () => {
    const sorted = [...produtos].sort((a, b) => b.precoOrg - a.precoOrg);
    setProdutos(sorted);
    setActiveButton("priceDesc");
  };

  if (!pedidos || !produtos) return <h1>Carregando...</h1>;

  return (
    <Main>
      <section className="flex justify-end w-full">
        <div className="container mx-auto mt-4 flex justify-center md:max-w-[1280px]">
          <div className="w-full max-w-[680px]">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl">
                  Pedidos - {pedidos.length} pendentes
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4 md:ml-auto border-2 rounded-md border-gray-300 overflow-y-scroll max-h-[400px] p-10 bg-white shadow-xl">
              {pedidos.length > 0 ? (
                pedidos.map((pedido: any, index: number) => (
                  <section key={index} className="">
                    
                  </section>
                ))
              ) : (
                <h1>Não há pedidos pendentes</h1>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="flex justify-end w-full">
        <div className="container mx-auto mt-4 flex justify-center md:max-w-[1280px]">
          <div className="w-full max-w-[680px]">
            <div className="flex justify-between place-items-end">
              <div>
                <h2 className="text-2xl">
                  Estoque - {produtos.length} produtos
                </h2>
                <div className="font-bold">
                  <button
                    onClick={sortByNameAsc}
                    className={`cursor-pointer transition-all hover:scale-110 duration-200 shadow-md w-12 p-2 m-1 rounded-md ${
                      activeButton === "nameAsc"
                        ? "bg-[var(--primary)]"
                        : "bg-white"
                    }`}
                  >
                    a-Z
                  </button>
                  <button
                    onClick={sortByNameDesc}
                    className={`cursor-pointer transition-all hover:scale-110 duration-200 shadow-md w-12 p-2 m-1 rounded-md ${
                      activeButton === "nameDesc"
                        ? "bg-[var(--primary)]"
                        : "bg-white"
                    }`}
                  >
                    z-A
                  </button>
                  <button
                    onClick={sortByPriceAsc}
                    className={`cursor-pointer transition-all hover:scale-110 duration-200 shadow-md w-12 p-2 m-1 rounded-md ${
                      activeButton === "priceAsc"
                        ? "bg-[var(--primary)]"
                        : "bg-white"
                    }`}
                  >
                    $
                  </button>
                  <button
                    onClick={sortByPriceDesc}
                    className={`cursor-pointer transition-all hover:scale-110 duration-200 shadow-md w-12 p-2 m-1 rounded-md ${
                      activeButton === "priceDesc"
                        ? "bg-[var(--primary)]"
                        : "bg-white"
                    }`}
                  >
                    $$$
                  </button>
                </div>
              </div>
              <Link
                prefetch
                href={"/dashboard/adicionar-produto"}
                className="border font-bold p-2 rounded-md hover:bg-black hover:text-white transition-colors duration-200 text-xs md:text-lg"
              >
                Adicionar
              </Link>
            </div>
            <div className="hidden md:grid grid-cols-1 gap-4 mt-4 md:ml-auto border-2 rounded-md border-gray-300 overflow-y-scroll max-h-[400px] p-10 bg-white shadow-xl">
              {produtos.length > 0 ? (
                produtos.map((produto, index: number) => (
                  <ProdutoCard
                    key={index}
                    layout="horizontal"
                    produto={produto}
                    loading={loading}
                    isAdmin={session?.user.role === "admin"}
                  />
                ))
              ) : (
                <h1>Não há produtos no estoque</h1>
              )}
            </div>
            <div className="md:hidden grid grid-cols-1 gap-4 mt-4 md:ml-auto border-2 rounded-md border-gray-300 overflow-y-scroll max-h-[400px] p-10 bg-white shadow-xl">
              {produtos.length > 0 ? (
                produtos.map((produto, index: number) => (
                  <ProdutoCard
                    key={index}
                    layout="vertical"
                    produto={produto}
                    loading={loading}
                    isAdmin={session?.user.role === "admin"}
                  />
                ))
              ) : (
                <h1>Não há produtos no estoque</h1>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-end w-full py-5">
        <div className="container mx-auto mt-4 flex justify-center md:max-w-[1280px]">
          <div className="w-full max-w-[680px] flex justify-center">
            <button
              className="border cursor-pointer transition-colors duration-200 font-bold text-red-500 border-red-500 hover:bg-red-500 hover:text-white p-2 rounded-md text-2xl"
              onClick={() => signOut({ callbackUrl: "/home" })}
            >
              Sair da conta
            </button>
          </div>
        </div>
      </section>
    </Main>
  );
}
