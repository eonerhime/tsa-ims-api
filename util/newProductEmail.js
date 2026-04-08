const newProductTemplate = (product) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">New Product Alert 🚀</h2>
      <p>Hello Admin,</p>
      <p>A new item has been added to the inventory. Here are the details:</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 10px;"><strong>Name:</strong> ${product.name}</li>
          <li style="margin-bottom: 10px;"><strong>Description:</strong> ${product.description}</li>
          <li style="margin-bottom: 10px;"><strong>Price:</strong> <span style="color: #27ae60; font-weight: bold;">₦${product.price.toLocaleString()}</span></li>
          <li style="margin-bottom: 10px;"><strong>Quantity:</strong> ${product.quantity}</li>
        </ul>
      </div>

      ${
        product.imageUrl
          ? `
        <div style="text-align: center; margin-top: 20px;">
          <img src="${product.imageUrl}" alt="${product.name}" style="max-width: 200px; border-radius: 8px; border: 1px solid #ddd;" />
        </div>
      `
          : ""
      }

      <p style="font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
        This is an automated notification from the Inventory Management System.
      </p>
    </div>
  `;
};

module.exports = newProductTemplate;
