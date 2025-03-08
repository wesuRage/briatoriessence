"use client";

import { useState, ChangeEvent } from 'react';

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Obtendo a assinatura do servidor Next.js
      const response = await fetch('/api/cloudinary', {
        method: 'POST',
      });

      const { timestamp, signature, cloudName, apiKey } = await response.json();

      // Preparando o upload para o Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', apiKey);
      formData.append('signature', signature);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const uploadResponse = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      setUploadedImageUrl(uploadData.secure_url);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>

      {uploadedImageUrl && (
        <div>
          <p>Upload bem-sucedido!</p>
          <img src={uploadedImageUrl} alt="Imagem carregada" width={300} />
        </div>
      )}
    </div>
  );
};
