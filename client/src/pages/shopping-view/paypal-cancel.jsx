import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

function PaypalCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-600">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your PayPal payment has been cancelled. You can try again or choose
            a different payment method.
          </p>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => navigate("/shop/checkout")}
              className="w-full"
            >
              Try Again
            </Button>
            <Button
              onClick={() => navigate("/shop/listing")}
              variant="outline"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaypalCancelPage;
