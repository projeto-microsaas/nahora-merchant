import React from "react";

export const toast = {
  success: (message) => alert(`Sucesso: ${message}`),
  error: (message) => alert(`Erro: ${message}`),
};