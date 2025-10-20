<script>
  import { alertConfirm, alertError, alertSuccess } from "$lib/alert";
  import AuthGuard from "$lib/component/AuthGuard.svelte";
  import Modal from "$lib/component/Modal.svelte";
  import { Eye } from "lucide-svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {
    fetchTransaksi,
    createTransaksi,
    getDetailTransaksi,
  } from "$lib/api/transaksi";

  let transaksi = [];
  let searchTerm = "";
  let currentPage = 1;
  const itemsPerPage = 10;
  let OpenAddModal = false;

  const fields = [
    { name: "sku", label: "SKU", type: "text", required: true },
    { name: "name", label: "Nama Produk", type: "text", required: true },
    {
      name: "kategori",
      label: "Kategori",
      type: "select",
      placeholder: "Pilih kategori",
      options: [
        { label: "Sabun", value: "sabun" },
        { label: "Lotion", value: "lotion" },
        { label: "Shampoo", value: "shampoo" },
      ],
    },
    { name: "stok", label: "Stok", type: "number" },
  ];

  // 🔽 state untuk sorting
  let sortField = "trx_code";
  let sortOrder = "asc"; // asc | desc

  onMount(async () => {
    transaksi = await fetchTransaksi();
  });

  // 🔍 filter berdasarkan kode transaksi
  $: filteredTransaksi = transaksi.filter((t) =>
    t.trx_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔄 urutkan data
  $: sortedTransaksi = [...filteredTransaksi].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    // buat string jadi lowercase biar adil
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // 🔢 pagination
  $: totalPages = Math.ceil(sortedTransaksi.length / itemsPerPage);
  $: paginatedTransaksi = sortedTransaksi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  // ⬆️⬇️ toggle urutan
  function sortBy(field) {
    if (sortField === field) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      sortField = field;
      sortOrder = "asc";
    }
  }

  // 👁️ lihat detail transaksi
  async function handleDetail(trx) {
    console.log("Detail transaksi:", trx);
    // const detail = await getDetailTransaksi(trx.id);
    // goto(`/transaksi/${trx.id}`);
  }
</script>

<AuthGuard allowRole={["admin"]} />

<!-- 🔍 Pencarian & Tambah -->
<div class="mb-6 flex items-center justify-between">
  <button
    on:click={() => (OpenAddModal = true)}
    class="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-sm"
  >
    + Tambah
  </button>

  <input
    type="text"
    placeholder="🔍 Cari transaksi..."
    bind:value={searchTerm}
    class="border border-gray-300 focus:border-amber-500 focus:ring focus:ring-amber-100 rounded-lg px-4 py-2 m:w-1/2 shadow-sm"
  />
</div>

<!-- 📋 Table -->
<div
  class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
>
  <table class="min-w-full text-sm">
    <thead
      class="bg-gradient-to-r from-amber-500 to-amber-600 text-white uppercase text-xs"
    >
      <tr>
        <th class="p-3 text-center">No</th>

        <!-- klik header untuk sort -->
        <th
          class="p-3 text-left cursor-pointer select-none"
          on:click={() => sortBy("trx_code")}
        >
          Kode
          {#if sortField === "trx_code"}
            <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
          {/if}
        </th>

        <th
          class="p-3 text-left cursor-pointer select-none"
          on:click={() => sortBy("trx_type")}
        >
          Tipe
          {#if sortField === "trx_type"}
            <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
          {/if}
        </th>

        <th
          class="p-3 text-left cursor-pointer select-none"
          on:click={() => sortBy("note")}
        >
          Catatan
          {#if sortField === "note"}
            <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
          {/if}
        </th>

        <th
          class="p-3 text-left cursor-pointer select-none"
          on:click={() => sortBy("created_at")}
        >
          Tanggal
          {#if sortField === "created_at"}
            <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
          {/if}
        </th>

        <th class="p-3 text-center">Aksi</th>
      </tr>
    </thead>

    <tbody class="divide-y divide-gray-100">
      {#if paginatedTransaksi.length === 0}
        <tr>
          <td colspan="6" class="text-center p-6 text-gray-500">
            Tidak ada transaksi ditemukan
          </td>
        </tr>
      {:else}
        {#each paginatedTransaksi as trx, i}
          <tr class="hover:bg-amber-50 transition">
            <td class="p-3 text-gray-700 text-center">
              {(currentPage - 1) * itemsPerPage + i + 1}
            </td>
            <td class="p-3 font-mono">{trx.trx_code}</td>
            <td class="p-3">{trx.trx_type}</td>
            <td class="p-3">{trx.note}</td>
            <td class="p-3">
              {trx.created_at.replace("T", "-").replace(/(\.\d{2})\d+/, "$1")}
            </td>
            <td class="p-3 text-center">
              <button
                class="bg-amber-500 hover:bg-amber-600 text-white rounded-md p-1.5"
                on:click={() => handleDetail(trx)}
              >
                <Eye size={16} />
              </button>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<!-- 📄 Pagination -->
<div class="flex items-center justify-between mt-6">
  <div class="text-sm text-gray-600">
    Menampilkan {(currentPage - 1) * itemsPerPage + 1} -
    {Math.min(currentPage * itemsPerPage, sortedTransaksi.length)} dari
    {sortedTransaksi.length} data
  </div>
  <div class="flex items-center space-x-2">
    <button
      on:click={prevPage}
      disabled={currentPage === 1}
      class="px-3 py-1 bg-amber-500 text-white rounded-sm hover:bg-amber-600 disabled:opacity-50"
    >
      Prev
    </button>
    <span class="text-gray-700 font-medium">{currentPage}/{totalPages}</span>
    <button
      on:click={nextPage}
      disabled={currentPage === totalPages}
      class="px-3 py-1 bg-amber-500 text-white rounded-sm hover:bg-amber-600 disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>

<Modal modalTitle="Tambah Transaksi" isOpen={OpenAddModal} {fields} />
