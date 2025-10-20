import api from "$lib/api";

// Fungsi login
export async function login(nik, password) {
  try {
    const response = await api.post(
      "/auth/login",
      { nik, password }, // kirim JSON
      {
        headers: {
          "Content-Type": "application/json",
        },
        skipInterceptor: true, // biar interceptor nggak paksa token
      }
    );

    // Ambil token dari response
    const { access_token, token_type } = response.data;

    // Simpan token ke localStorage
    localStorage.setItem("token", access_token);
    localStorage.setItem("token_type", token_type);

    return { access_token, token_type };
  } catch (error) {
    // Penanganan error yang lebih rapi
    let message = "Login Failed";

    if (error.response) {
      message = error.response.data?.detail || error.response.statusText;
    } else if (error.request) {
      message = "No response from server";
    } else {
      message = error.message;
    }

    throw new Error(message);
  }
}
