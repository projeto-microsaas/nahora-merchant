import PropTypes from "prop-types";

const StatCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center">
        <Icon className="h-6 w-6 text-javai-purple mr-2" />
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  description: PropTypes.string.isRequired,
};

export default StatCard;