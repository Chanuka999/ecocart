import ProductDetailsDialog from "../../components/shopping-view/product-details";
import ShoppingProductTile from "../../components/shopping-view/product-tile";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import {
  addToCart,
  fetchCartItems,
} from "../../../store/shop/cart-slice/index.js";
import { fetchProductDetails } from "../../../store/shop/product-slice/index.js";
import {
  getSearchResults,
  resetSearchResults,
} from "../../../store/shop/search-slice/index.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [_searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const { user } = useSelector((state) => state.auth);

  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  useEffect(() => {
    // searchParams is intentionally unused here but returned by the hook; keep for future needs
    const trimmedKeyword = keyword?.trim();
    if (trimmedKeyword && trimmedKeyword.length >= 3) {
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${trimmedKeyword}`));
        dispatch(getSearchResults(trimmedKeyword));
        setShowSuggestions(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      if (!keyword || keyword.trim() === "") {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      }
      setShowSuggestions(false);
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch, setSearchParams]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleSuggestionClick(item) {
    // Set input to selected title, hide suggestions and open details
    setKeyword(item.title || "");
    setShowSuggestions(false);
    // update search param
    setSearchParams(
      new URLSearchParams(`?keyword=${encodeURIComponent(item.title)}`)
    );
    // open details
    handleGetProductDetails(item._id || item.id);
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(searchResults, "searchResults");

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center relative">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products..."
            onFocus={() => {
              if (searchResults && searchResults.length > 0)
                setShowSuggestions(true);
            }}
            onBlur={() => {
              // delay hiding to allow click
              setTimeout(() => setShowSuggestions(false), 150);
            }}
          />

          {showSuggestions && searchResults && searchResults.length > 0 ? (
            <ul className="absolute z-40 top-full left-0 right-0 bg-white border rounded-md shadow-md max-h-60 overflow-auto mt-1">
              {searchResults.map((item) => (
                <li
                  key={item._id || item.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={(e) => e.preventDefault()} /* prevent blur */
                  onClick={() => handleSuggestionClick(item)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="text-5xl font-extrabold">No result found!</h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            key={item._id || item.id}
            handleAddtoCart={handleAddtoCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
