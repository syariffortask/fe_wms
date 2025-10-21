import api from "$lib/api";

export async function fetchTransaksi() {
  const res = await api.get("/transactions/");
  return res.data;
}

export async function createTransaksi(data) {
  try {
    const res = await api.post("/transactions/", data);
    return res.data;
  } catch (error) {
    if (error.response) {
      const err = new Error(
        error.response.data?.detail || "Terjadi kesalahan saat membuat transaksi"
      );
      err.status = error.response.status;
      throw err;
    }

    // kalau error lain (misal jaringan / timeout)
    throw new Error("Tidak dapat terhubung ke server");
  }
}

export async function getDetailTransaksi(id) {
  const res = await api.get(`/transactions/${id}`);
  return res.data;
}
