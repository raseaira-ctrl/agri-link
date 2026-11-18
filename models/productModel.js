const { ObjectId } = require("mongodb");

const collectionName = "products";

function collection(db) {
  return db.collection(collectionName);
}

async function getAllProducts(db) {
  return collection(db)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

async function getProductById(db, id) {
  if (!ObjectId.isValid(id)) return null;

  return collection(db).findOne({
    _id: new ObjectId(id)
  });
}

async function createProduct(db, data) {
  const product = {
    name: String(data.name).trim(),
    category: String(data.category).trim(),
    price: Number(data.price),
    stock: Number(data.stock),
    description: data.description || "",
    image: data.image || "",
    sellerName: data.sellerName || "",
    sellerContact: data.sellerContact || "",
    location: data.location || "",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await collection(db).insertOne(product);

  return {
    _id: result.insertedId,
    ...product
  };
}

async function updateProduct(db, id, updates) {
  if (!ObjectId.isValid(id)) return null;

  const result = await collection(db).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } }
  );

  return result;
}

async function deleteProduct(db, id) {
  if (!ObjectId.isValid(id)) return null;

  return collection(db).deleteOne({
    _id: new ObjectId(id)
  });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

