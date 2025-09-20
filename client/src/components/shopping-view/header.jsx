import { useDispatch } from "react-redux";
import { logoutUser } from "../../../store/auth-slice";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const ShoppingHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/auth/login");
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 w-full">
      <div>shopping view header</div>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default ShoppingHeader;
