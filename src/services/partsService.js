import axios from "axios";
import qs from "qs";

const KEYS = {
  parts: "parts",
  partId: "partId",
};

export function insertPart(data) {
  let parts = getAllParts();
  // data['id'] = generatePartId()
  // parts.push(data)
  // localStorage.setItem(KEYS.parts,JSON.stringify(parts))
  axios.post("https://inventoryspring.herokuapp.com/api/v1/parts", data);
  console.log(data);
  console.log("Insert Part Running");
}
export function editPart(data) {
  axios
    .put("https://inventoryspring.herokuapp.com/api/v1/parts/" + data.id, qs.stringify(data))
    .catch((err) => {
      console.log(err);
    });
  console.log(data);
  console.log("Edit Part Running");
}

export function generatePartId() {
  if (localStorage.getItem(KEYS.partId) == null)
    localStorage.setItem(KEYS.partId, "0");
  var id = parseInt(localStorage.getItem(KEYS.partId));
  localStorage.setItem(KEYS.partId, (++id).toString());
  return id;
}

export function getAllParts() {
  if (localStorage.getItem(KEYS.parts) == null)
    localStorage.setItem(KEYS.parts, JSON.stringify([]));
  return JSON.parse(localStorage.getItem(KEYS.parts));
}
