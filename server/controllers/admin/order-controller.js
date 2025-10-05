import Order from "../../models/Order.js";

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    console.log("🔍 Admin: Fetching all orders...");
    const orders = await Order.find({}).sort({ createdAt: -1 }); // Sort by newest first

    if (!orders.length) {
      console.log("📝 Admin: No orders found");
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    console.log(`✅ Admin: Found ${orders.length} orders`);
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("❌ Admin: Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: error.message,
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Admin: Fetching order details for ID: ${id}`);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required!",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      console.log(`❌ Admin: Order not found for ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    console.log(`✅ Admin: Order details fetched for ID: ${id}`);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Admin: Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    console.log(
      `🔄 Admin: Updating order status for ID: ${id} to: ${orderStatus}`
    );

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required!",
      });
    }

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required!",
      });
    }

    // Validate order status
    const validStatuses = [
      "pending",
      "inProcess",
      "inShipping",
      "delivered",
      "rejected",
    ];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Valid statuses are: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      console.log(`❌ Admin: Order not found for ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus,
        orderUpdateDate: new Date(),
      },
      { new: true } // Return the updated document
    );

    console.log(`✅ Admin: Order status updated successfully for ID: ${id}`);
    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Admin: Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: error.message,
    });
  }
};

export { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus };
