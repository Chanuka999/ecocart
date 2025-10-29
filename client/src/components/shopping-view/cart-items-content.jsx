import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { DeleteCartItem, updateCartItem } from "../../../store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import defaultImg from "../../assets/account.jpg";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    dispatch(
      updateCartItem({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      DeleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      {(() => {
        // Handle a variety of shapes for the image value and normalize to a usable src string.
        // Supported shapes: string URL, relative path, object { url, secure_url, path },
        // array of those, or single-file strings inside arrays.
        const rawImage = cartItem?.image;
        let imageSrc = null;

        const normalizeString = (str) => {
          if (!str) return null;
          // If it's a relative path (starts with / or doesn't contain http), prepend origin
          try {
            const trimmed = String(str).trim();
            if (/^https?:\/\//i.test(trimmed)) return trimmed;
            if (trimmed.startsWith("/"))
              return window.location.origin + trimmed;
            // If it's a simple filename or relative path without leading slash, also prepend origin
            if (!trimmed.includes("://"))
              return window.location.origin + "/" + trimmed;
            return trimmed;
          } catch {
            return null;
          }
        };

        if (!rawImage) {
          imageSrc = defaultImg;
        } else if (typeof rawImage === "string") {
          imageSrc = normalizeString(rawImage) || defaultImg;
        } else if (Array.isArray(rawImage)) {
          // Try first element as string or object
          const first = rawImage[0];
          if (typeof first === "string")
            imageSrc = normalizeString(first) || defaultImg;
          else if (typeof first === "object")
            imageSrc =
              normalizeString(first?.url) ||
              normalizeString(first?.secure_url) ||
              normalizeString(first?.path) ||
              normalizeString(first?.src) ||
              defaultImg;
          else imageSrc = defaultImg;
        } else if (typeof rawImage === "object") {
          imageSrc =
            normalizeString(rawImage?.url) ||
            normalizeString(rawImage?.secure_url) ||
            normalizeString(rawImage?.path) ||
            normalizeString(rawImage?.src) ||
            defaultImg;
        } else {
          imageSrc = defaultImg;
        }

        return (
          <img
            src={imageSrc}
            alt={cartItem?.title || "product image"}
            className="w-20 h-20 rounded object-cover"
            onError={(e) => {
              e.currentTarget.src = defaultImg;
            }}
          />
        );
      })()}
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
