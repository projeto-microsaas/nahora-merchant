import { Link } from "react-router-dom";

const DeliveryCard = ({ delivery }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{delivery.customer}</h3>
      <p className="text-sm text-gray-600">Retirada: {delivery.pickupAddress}</p>
      <p className="text-sm text-gray-600">Entrega: {delivery.deliveryAddress}</p>
      <p className="text-sm text-gray-600">Status: {delivery.status}</p>
      <p className="text-sm text-gray-600">Detalhes: {delivery.packageDetails}</p>
      <p className="text-sm text-gray-600">Instruções: {delivery.instructions || "Nenhuma"}</p>
      <p className="text-sm text-gray-500">Criado em: {new Date(delivery.createdAt).toLocaleDateString()}</p>
      <Link to={`/deliveries/${delivery._id}`}>
        <button className="mt-2 bg-javai-purple hover:bg-javai-purple-dark text-white font-semibold py-1 px-3 rounded">
          Ver Detalhes
        </button>
      </Link>
    </div>
  );
};

export default DeliveryCard;