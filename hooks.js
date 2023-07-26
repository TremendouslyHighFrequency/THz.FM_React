import { useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { FrappeContext } from 'frappe-react-sdk'; // adjust this import to your setup

export const useFrappeRouting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const frappe = useContext(FrappeContext);

  useEffect(() => {
    // Set Frappe route to match the current URL on component mount
    const frappeRoute = location.pathname.split('/').slice(1); // Frappe routes are arrays
    frappe.set_route(frappeRoute);
  }, []);

  useEffect(() => {
    // Update the URL whenever Frappe's route changes
    const url = '/' + frappe.get_route().join('/');
    if (location.pathname !== url) {
      navigate(url);
    }
  }, [frappe.get_route()]);

  return frappe;
};
