import paypal from "../../helpers/paypal.js";
import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

const createOrder = async (req, res) => {
  try {
    console.log("=== ORDER CREATION REQUEST ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Validate required fields
    if (!cartItems || !cartItems.length) {
      console.log("❌ Validation failed: Cart items are required");
      return res.status(400).json({
        success: false,
        message: "Cart items are required",
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      console.log("❌ Validation failed: Valid total amount is required");
      return res.status(400).json({
        success: false,
        message: "Valid total amount is required",
      });
    }

    if (!userId) {
      console.log("❌ Validation failed: User ID is required");
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    console.log("✅ Initial validations passed");

    // Check for existing pending orders for the same user and cart to prevent duplicates
    console.log("🔍 Checking for duplicate orders...");
    const existingOrder = await Order.findOne({
      userId,
      cartId,
      orderStatus: "pending",
      paymentStatus: "pending",
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // Within last 5 minutes
    });

    if (existingOrder) {
      console.log("❌ Duplicate order attempt prevented for user:", userId);
      return res.status(400).json({
        success: false,
        message:
          "A payment is already in progress. Please wait or refresh the page.",
      });
    }

    console.log("✅ No duplicate orders found");

    // Calculate item total for validation
    console.log("🧮 Calculating totals...");
    const itemsTotal = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Ensure the total matches the calculated amount
    const calculatedTotal = parseFloat(itemsTotal.toFixed(2));
    const providedTotal = parseFloat(totalAmount.toFixed(2));

    console.log("Calculated total:", calculatedTotal);
    console.log("Provided total:", providedTotal);

    if (Math.abs(calculatedTotal - providedTotal) > 0.01) {
      console.log("❌ Total amount mismatch");
      return res.status(400).json({
        success: false,
        message: "Total amount mismatch",
      });
    }

    console.log("✅ Total validation passed");

    console.log("🎯 Creating PayPal payment...");
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: parseFloat(item.price).toFixed(2),
              currency: "USD",
              quantity: parseInt(item.quantity),
            })),
          },
          amount: {
            currency: "USD",
            total: parseFloat(totalAmount).toFixed(2),
          },
          description: "EcoCart Purchase",
        },
      ],
    };

    console.log(
      "Creating PayPal payment with data:",
      JSON.stringify(create_payment_json, null, 2)
    );

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log("❌ PayPal Error Details:", error);
        console.log("❌ Error Response:", error.response);
        return res.status(500).json({
          success: false,
          message: "Error creating PayPal payment",
          error: error.response ? error.response : error.message,
        });
      } else {
        console.log("✅ PayPal payment created successfully:", paymentInfo.id);

        try {
          const newlyCreatedOrder = new Order({
            userId,
            cartId,
            cartItems,
            addressInfo,
            orderStatus: "pending",
            paymentMethod,
            paymentStatus: "pending",
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId: paymentInfo.id,
            payerId: "",
          });

          await newlyCreatedOrder.save();
          console.log("✅ Order saved to database:", newlyCreatedOrder._id);

          const approvalURL = paymentInfo.links.find(
            (link) => link.rel === "approval_url"
          ).href;

          console.log("✅ Sending success response with approval URL");
          res.status(201).json({
            success: true,
            approvalURL,
            orderId: newlyCreatedOrder._id,
          });
        } catch (dbError) {
          console.log("❌ Database error while saving order:", dbError);
          return res.status(500).json({
            success: false,
            message: "Error saving order to database",
            error: dbError.message,
          });
        }
      }
    });
  } catch (error) {
    console.log("❌ Create order error:", error);
    console.log("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: error.message,
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: order.totalAmount.toFixed(2),
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async (error, payment) => {
        if (error) {
          console.log("❌ PayPal execution error:", error);
          return res.status(500).json({
            success: false,
            message: "Error executing PayPal payment",
          });
        } else {
          console.log("✅ PayPal payment executed successfully");

          order.paymentStatus = "paid";
          order.orderStatus = "confirmed";
          order.paymentId = paymentId;
          order.payerId = payerId;

          // Update product stock
          for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);

            if (!product) {
              return res.status(404).json({
                success: false,
                message: `Product not found: ${item.title}`,
              });
            }

            if (product.totalStock < item.quantity) {
              return res.status(400).json({
                success: false,
                message: `Not enough stock for product: ${product.title}`,
              });
            }

            product.totalStock -= item.quantity;
            await product.save();
          }

          // Delete the cart
          const getCartId = order.cartId;
          await Cart.findByIdAndDelete(getCartId);

          await order.save();

          res.status(200).json({
            success: true,
            message: "Order confirmed",
            data: order,
          });
        }
      }
    );
  } catch (error) {
    console.log("❌ Capture payment error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("❌ Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log("❌ Get order details error:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

export { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails };
