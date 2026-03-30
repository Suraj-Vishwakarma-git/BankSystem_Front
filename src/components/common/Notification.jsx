import { useEffect } from "react";
import "./Notification.css"
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notif ${type}`}>
      {message}
    </div>
  );
};

export default Notification;