import Swal from "sweetalert2";

export function alertError(tittle, msg) {
  Swal.fire({
    icon: "error",
    iconColor: "#1E2939",
    title: tittle,
    text: msg,
    showConfirmButton: false,
    timer: 2500,
  });
}

export function alertSuccess(tittle, msg) {
  Swal.fire({
    icon: "success",
    title: tittle,
    text: msg,
    showConfirmButton: false,
    timer: 1500,
  });
}

export function alertConfirm(title, msg) {
  return Swal.fire({
    icon: "warning",
    title,
    text: msg,
    confirmButtonColor: "#FFB300",
    cancelButtonColor: "#d33",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
  });
}
