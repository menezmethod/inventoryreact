import axios from "axios";
import qs from "qs";

const KEYS = {
  products: "products",
  productId: "productId",
};

export function insertProduct(data) {
  let products = getAllProducts();
  // data['id'] = generateProductId()
  // products.push(data)
  // localStorage.setItem(KEYS.products,JSON.stringify(products))
  axios.post("http://localhost:8080/api/v1/products", data);
  console.log(data);
  console.log("Insert Product Running");
}
export function editProduct(data) {
  axios
    .put("http://localhost:8080/api/v1/products/" + data.id, qs.stringify(data))
    .catch((err) => {
      console.log(err);
    });
  console.log(data);
  console.log("Edit Product Running");
}

export function generateProductId() {
  if (localStorage.getItem(KEYS.productId) == null)
    localStorage.setItem(KEYS.productId, "0");
  var id = parseInt(localStorage.getItem(KEYS.productId));
  localStorage.setItem(KEYS.productId, (++id).toString());
  return id;
}

export function getAllProducts() {
  if (localStorage.getItem(KEYS.products) == null)
    localStorage.setItem(KEYS.products, JSON.stringify([]));
  return JSON.parse(localStorage.getItem(KEYS.products));
}
