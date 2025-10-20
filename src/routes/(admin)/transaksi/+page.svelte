<script>
  import { alertConfirm, alertError, alertSuccess } from "$lib/alert";
  import AuthGuard from "$lib/component/AuthGuard.svelte";
  import { Eye } from "lucide-svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {
    fetchTransaksi,
    createTransaksi,
    getDetailTransaksi,
  } from "$lib/api/transaksi";

  let transaksi = [];
  let searchTerm = ""; // 🔍 input pencarian
  let currentPage = 1;
  const itemsPerPage = 10;

  onMount(async () => {
    transaksi = await fetchTransaksi();
  });

  // 🔍 Filter berdasarkan kode transaksi
  $: filteredTransaksi = transaksi.filter((t) =>
    t.trx_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📄 Pagination
  $: totalPages = Math.ceil(filteredTransaksi.length / itemsPerPage);
  $: paginatedTransaksi = filteredTransaksi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  // 🔎 Lihat detail transaksi
  async function handleDetail(trx) {
    // const detail = await getDetailTransaksi(trx.id);
    console.log("Detail transaksi:", trx);
    // misal kamu mau pindah ke halaman detail
    // goto(`/transaksi/${trx.id}`);
  }
</script>

<AuthGuard allowRole={["admin"]} />

<!-- 🔍 Pencarian & Tambah -->
<div class="mb-6 flex items-center justify-between">
  <button
    on:click={() => (showModal = true)}
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
        <th class="p-3 text-left">Kode</th>
        <th class="p-3 text-left">Tipe</th>
        <th class="p-3 text-left">Catatan</th>
        <th class="p-3 text-left">Tanggal</th>
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
    {Math.min(currentPage * itemsPerPage, filteredTransaksi.length)} dari
    {filteredTransaksi.length} data
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
