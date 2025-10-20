import api from "$lib/api";

export async function fetchBarang() {
  const res = await api.get("/items/");
  return res.data;
}

export async function fetchBarangById(id) {
  const res = await api.get(`/items/${id}`);
  return res.data;
}

export async function createBarang(data) {
  const res = await api.post("/items/", data);
  return res.data;
}

export async function updateBarang(id, data) {
  const res = await api.put(`/items/${id}`, data);
  return res.data;
}

export async function deleteBarang(id) {
  const res = await api.delete(`/items/${id}`);
  return res.data;
}