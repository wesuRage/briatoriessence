"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.number().positive("Preço deve ser positivo"),
  discountedPrice: z
    .number()
    .positive("Preço riscado deve ser positivo")
    .optional(),
  sold: z
    .number()
    .int("Vendidos deve ser um número inteiro")
    .positive("Vendidos deve ser positivo"),
  tags: z.string().min(1, "Tags são obrigatórias"),
  images: z
    .array(z.instanceof(File))
    .nonempty("Pelo menos uma imagem é obrigatória"),
});

type FormData = z.infer<typeof schema>;

export default function AdicionarProduto() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [images, setImages] = useState<File[]>([]);

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    if (data.discountedPrice) {
      formData.append("discountedPrice", data.discountedPrice.toString());
    }
    formData.append("sold", data.sold.toString());
    formData.append("tags", data.tags);
    images.forEach((image) => {
      formData.append("images", image);
    });

    // Enviar o formData para o servidor
    console.log("Form data submitted:", formData);
  };

  const handleDrop = (acceptedFiles: File[]) => {
    setImages([...images, ...acceptedFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div className="flex justify-center relative items-center h-full top-[100px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-2 bg-white border-gray-300 p-6 rounded-md w-full md:max-w-[450px] shadow-xl space-y-4"
      >
        <h1 className="text-2xl font-bold mb-4 text-black">
          Adicionar Produto
        </h1>

        <div className="relative">
          <div
            {...getRootProps()}
            className={`peer h-10 w-full border rounded-md px-3 py-5 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none cursor-pointer ${
              errors.images ? "border-red-400" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <p className="peer-placeholder-shown:text-gray-400">
              Arraste e solte as imagens aqui, ou clique para selecionar
            </p>
          </div>
          <label
            htmlFor="images"
            className={`select-none absolute bg-white p-[2px] left-3 transition-all peer-placeholder-shown:top-[0.45rem] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 top-[-0.8rem] text-sm ${
              errors.images ? "text-red-400" : "text-gray-300"
            } peer-focus:text-[var(--primary)] peer-focus:top-[-0.8rem] peer-focus:text-sm`}
          >
            Imagens*
          </label>
          {errors.images && (
            <span className="text-red-400">{errors.images.message}</span>
          )}
          <div className="mt-2">
            {images.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 justify-between"
              >
                <section className="flex items-center space-x-2">
                  <Image
                    width={64}
                    height={64}
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-16 h-16 object-cover"
                  />
                  <p>{file.name}</p>
                </section>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="flex items-center justify-center text-black p-4 border border-black w-16 rounded-md hover:bg-black hover:text-white transition-colors duration-200"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <input
            id="name"
            {...register("name")}
            className={`peer h-10 w-full border rounded-md px-3 py-5 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none ${
              errors.name ? "border-red-400" : "border-gray-300"
            }`}
            placeholder=" "
          />
          <label
            htmlFor="name"
            className={`select-none absolute bg-white p-[2px] left-3 transition-all peer-placeholder-shown:top-[0.45rem] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 top-[-0.8rem] text-sm ${
              errors.name ? "text-red-400" : "text-gray-300"
            } peer-focus:text-[var(--primary)] peer-focus:top-[-0.8rem] peer-focus:text-sm`}
          >
            Nome*
          </label>
          {errors.name && (
            <span className="text-red-400">{errors.name.message}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className={`peer h-10 w-full border rounded-md px-3 py-5 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none ${
                errors.price ? "border-red-400" : "border-gray-300"
              }`}
              placeholder=" "
            />
            <label
              htmlFor="price"
              className={`select-none absolute bg-white p-[2px] left-3 transition-all peer-placeholder-shown:top-[0.45rem] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 top-[-0.8rem] text-sm ${
                errors.price ? "text-red-400" : "text-gray-300"
              } peer-focus:text-[var(--primary)] peer-focus:top-[-0.8rem] peer-focus:text-sm`}
            >
              Preço*
            </label>
            {errors.price && (
              <span className="text-red-400">{errors.price.message}</span>
            )}
          </div>

          <div className="relative">
            <input
              id="discountedPrice"
              type="number"
              step="0.01"
              {...register("discountedPrice", { valueAsNumber: true })}
              className={`peer h-10 w-full border rounded-md px-3 py-5 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none ${
                errors.discountedPrice ? "border-red-400" : "border-gray-300"
              }`}
              placeholder=" "
            />
            <label
              htmlFor="discountedPrice"
              className={`select-none absolute bg-white p-[2px] left-3 transition-all peer-placeholder-shown:top-[0.45rem] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 top-[-0.8rem] text-sm ${
                errors.discountedPrice ? "text-red-400" : "text-gray-300"
              } peer-focus:text-[var(--primary)] peer-focus:top-[-0.8rem] peer-focus:text-sm`}
            >
              Preço Riscado
            </label>
            {errors.discountedPrice && (
              <span className="text-red-400">
                {errors.discountedPrice.message}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <input
            id="sold"
            type="number"
            {...register("sold", { valueAsNumber: true })}
            className={`peer h-10 w-full border rounded-md px-3 py-5 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none ${
              errors.sold ? "border-red-400" : "border-gray-300"
            }`}
            placeholder=" "
          />
          <label
            htmlFor="sold"
            className={`select-none absolute bg-white p-[2px] left-3 transition-all peer-placeholder-shown:top-[0.45rem] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 top-[-0.8rem] text-sm ${
              errors.sold ? "text-red-400" : "text-gray-300"
            } peer-focus:text-[var(--primary)] peer-focus:top-[-0.8rem] peer-focus:text-sm`}
          >
            Vendidos*
          </label>
          {errors.sold && (
            <span className="text-red-400">{errors.sold.message}</span>
          )}
        </div>

        <div className="relative">
          <input
            id="tags"
            type="text"
            {...register("tags")}
            className={`peer h-10 w-full border rounded-md px-3 py-5 text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none ${
              errors.tags ? "border-red-400" : "border-gray-300"
            }`}
            placeholder=" "
          />
          <label
            htmlFor="tags"
            className={`select-none absolute bg-white p-[2px] left-3 transition-all peer-placeholder-shown:top-[0.45rem] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 top-[-0.8rem] text-sm ${
              errors.tags ? "text-red-400" : "text-gray-300"
            } peer-focus:text-[var(--primary)] peer-focus:top-[-0.8rem] peer-focus:text-sm`}
          >
            Tags*
          </label>
          {errors.tags && (
            <span className="text-red-400">{errors.tags.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-white text-black border border-black cursor-pointer hover:bg-black hover:text-white transition-colors duration-200 px-4 py-2 rounded-md shadow-sm"
        >
          Adicionar Produto
        </button>
      </form>
    </div>
  );
}
