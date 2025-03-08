"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark } from "react-icons/fa6";

interface CartModalProps {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  cartRef: React.RefObject<HTMLDivElement | null>;
}

const CartModal: React.FC<CartModalProps> = ({
  showCart,
  setShowCart,
  cartRef,
}) => (
  <AnimatePresence>
    {showCart && (
      <motion.section
        ref={cartRef}
        className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg z-50 flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.2 }}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-black">Carrinho</h1>
          <button
            onClick={() => setShowCart(false)}
            className="p-2 bg-[var(--primary)] rounded-full hover:bg-[var(--primary)] transition-colors"
          >
            <FaXmark className="text-black" />
          </button>
        </header>

        {/* Conteúdo */}
        <div className="flex flex-1 flex-col items-center justify-center p-4">
          <p className="text-lg text-black">Seu carrinho está vazio</p>
        </div>
      </motion.section>
    )}
  </AnimatePresence>
);

export default CartModal;
