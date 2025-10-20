import api from "$lib/api";

export async function fetchTransaksi() {
  const res = await api.get("/transactions/");
  return res.data;
}

export async function createTransaksi(data) {
  const res = await api.post("/transactions/", data);
  return res.data;
}

export async function getDetailTransaksi(id) {
  const res = await api.get(`/transactions/${id}`);
  return res.data;
}
