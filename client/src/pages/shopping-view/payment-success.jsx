import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600 text-2xl">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          <p>You will receive an email confirmation shortly.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/shop/account")}>
              View Orders
            </Button>
            <Button variant="outline" onClick={() => navigate("/shop/home")}>
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
