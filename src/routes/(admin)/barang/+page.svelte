<script>
  import { onMount } from 'svelte';
  import { fetchBarang } from '$lib/api/barang';

  let barang = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  $: totalPages = Math.ceil(barang.length / itemsPerPage);
  $: paginatedBarang = barang.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  onMount(async () => {
    barang = await fetchBarang();
  });

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }
</script>

<h1 class="text-xl font-bold mb-4">Data Barang</h1>

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
      <tr><td colspan="5" class="text-center p-4">Loading data...</td></tr>
    {:else}
      {#each paginatedBarang as item, i}
        <tr class="border-t hover:bg-gray-50">
          <td class="p-2 border">{i + 1}</td>
          <td class="p-2 border">{item.sku}</td>
          <td class="p-2 border">{item.name}</td>
          <td class="p-2 border">{item.stock}</td>
          <td class="p-2 border">{item.rack}</td>
          <td class="p-2 border">{item.created_at}</td>
        </tr>
      {/each}
    {/if}
  </tbody>
</table>

<div class="flex items-center justify-between mt-4">
  <button
    on:click={prevPage}
    disabled={currentPage === 1}
    class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    ⬅ Prev
  </button>

  <span>Halaman {currentPage} dari {totalPages}</span>

  <button
    on:click={nextPage}
    disabled={currentPage === totalPages}
    class="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    Next ➡
  </button>
</div>
