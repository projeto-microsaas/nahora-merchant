// src/components/chat/ChatDialog.js
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import api from "../../api/services/api";

const ChatDialog = ({ deliveryId, triggerButton }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/chat/messages/${deliveryId}`);
      setMessages(response.data);
    } catch (err) {
      setError("Erro ao carregar mensagens: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await api.post(`/api/chat/messages/${deliveryId}`, {
        text: newMessage,
        sender: "merchant", // Substituir por autenticação do usuário logado
      });
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (err) {
      setError("Erro ao enviar mensagem: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Polling a cada 5 segundos
    return () => clearInterval(interval);
  }, [deliveryId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="flex items-center gap-2">
            <span>Chat</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat da Entrega #{deliveryId.slice(-5)}</DialogTitle>
        </DialogHeader>
        {error && <p className="text-destructive text-sm mb-2">{error}</p>}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <p className="text-gray-300 text-center">Carregando mensagens...</p>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.sender === "merchant" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    msg.sender === "merchant"
                      ? "bg-nahora-orange text-white"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-300 text-center">Nenhuma mensagem ainda.</p>
          )}
        </div>
        <form onSubmit={sendMessage} className="flex items-center gap-2 p-4 border-t border-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-2 bg-secondary text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-nahora-orange border border-input"
          />
          <Button type="submit" size="icon" className="bg-nahora-orange hover:bg-nahora-orange-dark">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;