import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "lucide-react";

const ShoppingProductTitle = ({ product }) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
            <h2>{product?.title}</h2>
      </div>
    </Card>
  );
};

export default ShoppingProductTitle;
