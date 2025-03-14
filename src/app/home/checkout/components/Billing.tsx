import axios from "axios";
import { motion } from "framer-motion";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Billing({
  advanceTo,
  session,
}: {
  advanceTo: (targetStep: "cart" | "address" | "billing" | "success") => void;
  session: Session | null;
}) {
  const router = useRouter();
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      const dadosPedido = sessionStorage.getItem("pedidoPendente");

      if (!dadosPedido) {
        router.push("/home/checkout/erro");
        return;
      }

      setPedido(JSON.parse(dadosPedido));
      setLoading(false);
    };

    carregarDados();
  }, []);

  const finalizarPedido = async () => {
    try {
      // 1. Criar pedido no banco
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pedido,
          status: "pago",
          meioPagamento: "cartão", // Atualizar com gateway real
        }),
      });

      if (!response.ok) throw new Error("Erro ao finalizar pedido");

      // 2. Limpar carrinho
      await axios.delete("/api/usuario/carrinho");

      // 3. Limpar sessionStorage
      sessionStorage.removeItem("pedidoPendente");

      router.push("/sucesso");
    } catch (error) {
      console.error(error);
      alert("Erro ao processar pagamento");
    }
  };

  if (loading || !pedido) return <div className="text-center p-8">Carregando...</div>;

  return (
    <motion.div
      key="cart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full md:max-w-[550px] bg-white border border-gray-300 rounded-md p-4 mt-8"
    >
      <h2 className="text-2xl font-bold mb-6">Finalizar Pagamento</h2>

      {/* Resumo do Pedido */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>
        {pedido.produtos.map((produto: any, index: number) => (
          <div key={index} className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Image
                src={produto.produto.imagens[0]}
                alt={produto.produto.nome}
                width={60}
                height={60}
                className="rounded"
              />
              <div>
                <p className="font-medium">{produto.produto.nome}</p>
                <p className="text-sm text-gray-500">Qtd: {produto.quantidade}</p>
              </div>
            </div>
            <p className="font-medium">
              R$ {(produto.produto.precoDes * produto.quantidade).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Endereço de Entrega */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Endereço de Entrega</h3>
        <div className="space-y-2">
          <p>{pedido.endereco.logradouro}, {pedido.endereco.numero}</p>
          <p>{pedido.endereco.complemento}</p>
          <p>{pedido.endereco.bairro}</p>
          <p>{pedido.endereco.estado_cidade}</p>
          <p>CEP: {pedido.endereco.cep}</p>
        </div>
      </div>

      {/* Método de Pagamento */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Método de Pagamento</h3>
        <div className="p-4 bg-gray-50 rounded-md">
          <div className="flex items-center gap-3">
            <input 
              type="radio" 
              id="creditCard" 
              name="payment" 
              checked 
              className="accent-[var(--primary)]"
              onChange={() => {}}
            />
            <label htmlFor="creditCard" className="font-medium">
              Cartão de Crédito
            </label>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Número do Cartão"
                className="p-2 border rounded"
                disabled
              />
              <input
                type="text"
                placeholder="Validade (MM/AA)"
                className="p-2 border rounded"
                disabled
              />
            </div>
            <input
              type="text"
              placeholder="Nome do Titular"
              className="w-full p-2 border rounded"
              disabled
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-1/3 p-2 border rounded"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Total e Botão de Pagamento */}
      <div className="border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>R$ {(pedido.total - pedido.frete).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Frete ({pedido.tipoFrete}):</span>
          <span>R$ {pedido.frete.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>R$ {pedido.total.toFixed(2)}</span>
        </div>

        <button
          onClick={finalizarPedido}
          className="w-full mt-6 bg-[var(--primary)] text-white py-3 rounded-md hover:bg-[var(--primary-dark)] transition-colors"
        >
          Confirmar Pagamento
        </button>
      </div>
    </motion.div>
  );
}