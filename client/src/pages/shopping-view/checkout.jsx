import Address from "../../components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "../../components/shopping-view/cart-items-content";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import {
  createNewOrder,
  clearApprovalURL,
} from "../../../store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "../../components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

  // Clear any existing approval URL when component mounts
  useEffect(() => {
    dispatch(clearApprovalURL());
    // Clear payment progress flag if user navigated back
    sessionStorage.removeItem("paymentInProgress");

    // Test server connectivity
    fetch("http://localhost:5000/api/shop/order/health")
      .then((res) => res.json())
      .then((data) => console.log("✅ Server health check:", data))
      .catch((err) => console.error("❌ Server connectivity error:", err));
  }, [dispatch]);

  // Handle approval URL redirect with proper state management
  useEffect(() => {
    if (approvalURL && !isRedirecting) {
      setIsRedirecting(true);
      // Clear payment progress flag since we're redirecting
      sessionStorage.removeItem("paymentInProgress");
      window.location.href = approvalURL;
    }
  }, [approvalURL, isRedirecting]);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    // Prevent multiple clicks
    if (isPaymentStart || isRedirecting) {
      return;
    }

    // Check if there's already a payment in progress
    const paymentInProgress = sessionStorage.getItem("paymentInProgress");
    if (paymentInProgress) {
      toast({
        title: "Payment already in progress",
        description:
          "Please wait for the current payment to complete or refresh the page.",
        variant: "destructive",
      });
      return;
    }

    // More thorough cart validation
    console.log("Cart validation - cartItems:", cartItems);
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    // Validate cart items structure
    const invalidItems = cartItems.items.filter(
      (item) => !item.productId || !item.title || !item.price || !item.quantity
    );

    if (invalidItems.length > 0) {
      console.error("Invalid cart items found:", invalidItems);
      toast({
        title: "Invalid cart items",
        description:
          "Some items in your cart are missing required information. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Validate total amount
    if (!totalCartAmount || totalCartAmount <= 0) {
      toast({
        title: "Invalid cart total",
        description: "Cart total must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsPaymemntStart(true);
    // Mark payment as in progress
    sessionStorage.setItem("paymentInProgress", "true");

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    // Validate orderData before sending
    if (!orderData.userId) {
      console.error("Missing userId");
      setIsPaymemntStart(false);
      sessionStorage.removeItem("paymentInProgress");
      toast({
        title: "Authentication error",
        description: "Please log in again",
        variant: "destructive",
      });
      return;
    }

    if (!orderData.cartId) {
      console.error("Missing cartId");
      setIsPaymemntStart(false);
      sessionStorage.removeItem("paymentInProgress");
      toast({
        title: "Cart error",
        description: "Invalid cart. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    console.log("Order data being sent:", orderData);
    console.log("Cart items:", cartItems);
    console.log("Total amount:", totalCartAmount);

    dispatch(createNewOrder(orderData))
      .then((data) => {
        console.log("Order creation response:", data);
        if (data?.payload?.success) {
          // Keep payment start true, redirect will be handled by useEffect
          console.log("Order created successfully, redirecting to PayPal...");
        } else {
          setIsPaymemntStart(false);
          sessionStorage.removeItem("paymentInProgress");
          console.error("Order creation failed:", data);

          // Handle different types of failures
          let errorMessage = "Something went wrong";
          if (data.type?.includes("rejected")) {
            errorMessage =
              data.payload?.message ||
              data.error?.message ||
              "Order creation failed";
          } else if (data?.payload?.message) {
            errorMessage = data.payload.message;
          }

          toast({
            title: "Order creation failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Order creation error:", error);
        setIsPaymemntStart(false);
        sessionStorage.removeItem("paymentInProgress");
        toast({
          title: "Payment initialization failed",
          description:
            error.payload?.message || error.message || "Please try again later",
          variant: "destructive",
        });
      });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent
                  key={item.productId || item._id || JSON.stringify(item)}
                  cartItem={item}
                />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiatePaypalPayment}
              className="w-full"
              disabled={isPaymentStart || isRedirecting}
            >
              {isPaymentStart || isRedirecting
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
