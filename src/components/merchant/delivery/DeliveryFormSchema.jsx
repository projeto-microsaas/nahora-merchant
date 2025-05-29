import React from 'react';
import { z } from "zod";

export const deliveryFormSchema = z.object({
  pickupStreetType: z.string({
    required_error: "Tipo de logradouro é obrigatório",
  }),
  pickupStreet: z.string().min(3, {
    message: "Logradouro deve ter pelo menos 3 caracteres",
  }),
  pickupNeighborhood: z.string().min(2, {
    message: "Bairro é obrigatório",
  }),
  pickupNumber: z.string().min(1, {
    message: "Número é obrigatório",
  }),
  deliveryStreetType: z.string({
    required_error: "Tipo de logradouro é obrigatório",
  }),
  deliveryStreet: z.string().min(3, {
    message: "Logradouro deve ter pelo menos 3 caracteres",
  }),
  deliveryNeighborhood: z.string().min(2, {
    message: "Bairro é obrigatório",
  }),
  deliveryNumber: z.string().min(1, {
    message: "Número é obrigatório",
  }),
  deliveryType: z.enum(["house", "apartment"], {
    required_error: "Selecione o tipo de residência",
  }),
  deliveryBuildingNumber: z.string().optional(),
  deliveryAptNumber: z.string().optional(),
  recipientName: z.string().min(3, {
    message: "O nome do destinatário deve ter pelo menos 3 caracteres.",
  }),
  recipientPhone: z.string().min(10, {
    message: "Forneça um número de telefone válido.",
  }),
  deliveryInstructions: z.string().optional(),
  orderTotal: z.string().optional(),
});