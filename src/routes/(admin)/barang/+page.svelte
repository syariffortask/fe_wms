<script>
  import { onMount } from 'svelte';
  import { fetchBarang } from '$lib/api/barang';
  import AuthGuard from '$lib/component/AuthGuard.svelte';

  let barang = [];
  let searchTerm = ''; // <-- input pencarian
  let currentPage = 1;
  const itemsPerPage = 10;

  // ambil data dari API
  onMount(async () => {
    barang = await fetchBarang();
  });

  // filter barang berdasarkan nama / sku / rak
  $: filteredBarang = barang.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rack.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // pagination
  $: totalPages = Math.ceil(filteredBarang.length / itemsPerPage);
  $: paginatedBarang = filteredBarang.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }
</script>

<AuthGuard allowRole={['admin']} />

<h1 class="text-xl font-bold mb-4">Data Barang</h1>

<!-- Input Pencarian -->
<div class="mb-4">
  <input
    type="text"
    placeholder="Cari barang..."
    bind:value={searchTerm}
    class="border rounded px-3 py-2"
  />
</div>

<!-- Tabel Barang -->
<table class="table-auto w-full border-collapse border">
  <thead class="bg-gray-200">
    <tr>
      <th class="p-2 border">No</th>
      <th class="p-2 border">SKU</th>
      <th class="p-2 border">Nama Barang</th>
      <th class="p-2 border">Stok</th>
      <th class="p-2 border">Rak</th>
      <th class="p-2 border">Dibuat</th>
    </tr>
  </thead>
  <tbody>
    {#if paginatedBarang.length === 0}
      <tr><td colspan="6" class="text-center p-4">Data tidak ditemukan</td></tr>
    {:else}
      {#each paginatedBarang as item, i}
        <tr class="border-t hover:bg-gray-50 text-center">
          <td class="p-2 border">{(currentPage - 1) * itemsPerPage + i + 1}</td>
          <td class="p-2 border">{item.sku}</td>
          <td class="p-2 border">{item.name}</td>
          <td class="p-2 border">{item.stock}</td>
          <td class="p-2 border">{item.rack}</td>
          <td class="p-2 border">
            {new Date(item.created_at).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </td>
        </tr>
      {/each}
    {/if}
  </tbody>
</table>

<!-- Pagination -->
<div class="flex items-center justify-end mt-4">
  <button on:click={prevPage} disabled={currentPage === 1} class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">
    Prev
  </button>

  <span class="m-2">{currentPage}/{totalPages}</span>

  <button on:click={nextPage} disabled={currentPage === totalPages} class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50">
    Next
  </button>
</div>
