import { sql } from "../config/db.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await sql`
    SELECT * FROM products 
    ORDER BY created_at DESC
    `;

    console.log("fetched products", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(`Error fetching products, ${error}`);

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res, next) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const product = await sql`
    INSERT INTO products(name, price, image)
    VALUES (${name}, ${price}, ${image})
    RETURNING *
    `;

    console.log("New Products", product);
    res.status(201).json({ success: true, data: product[0] });
  } catch (error) {
    console.error(`Error creating product, ${error}`);

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await sql`
    SELECT * FROM products WHERE id=${id}
    `;

    console.log(`Product with id:${id}, ${product}`);

    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.error(`Error fetching product with ${id}, ${error}`);

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  try {
    const product = await sql`
    UPDATE products 
    SET name=${name}, price=${price}, image=${image}
    WHERE id=${id} 
    RETURNING *
    `;

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not Found",
      });
    }

    console.log(`Updating Product with id ${id}`);

    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.error(`Error updating product, ${error}`);

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await sql`DELETE  FROM products WHERE id=${id} RETURNING *
    `;

    if (product.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    console.log(`Product deleted successfully`);

    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.error(`Error deleting product, ${error}`);

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
