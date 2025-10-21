<script>
    // ambil id dari url
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { getDetailTransaksi } from '$lib/api/transaksi';
    import { formatDate } from '$lib/helper';
    const id = $page.params.id;

    let transaksi = [];

    onMount(async () => {
        const response = await getDetailTransaksi(id);
        transaksi = response;
        console.log(transaksi.items);
    })

</script>
{#if transaksi}
    <!-- Wrapper -->
    <div class="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md shadow-md p-6">
        <!-- Header transaksi -->
        <div class="flex flex-col md:flex-row md:items-start md:justify-between w-full">
            <!-- Kiri -->
            <div class="space-y-1 md:text-left text-sm md:text-base">
                <p><span class="font-semibold">Jenis:</span> {transaksi.trx_type}</p>
                <p><span class="font-semibold">Tanggal:</span> {formatDate(transaksi.created_at)}</p>
            </div>
            <!-- Kanan -->
            <div class="space-y-1 md:text-right text-sm md:text-base mt-3 md:mt-0">
                <p><span class="font-semibold">Kode:</span> {transaksi.trx_code}</p>
                <p><span class="font-semibold">Note:</span> {transaksi.note}</p>
            </div>
        </div>
    </div>
    <div class="bg-white rounded-md shadow overflow-hidden">
  <!-- ✅ Tambahkan pembungkus dengan tinggi maksimum dan scroll -->
  <div class="max-h-[480px] overflow-y-auto">
    <table class="w-full border-collapse">
      <thead class="sticky top-0 bg-amber-100 z-10">
        <tr>
          <th class="py-2 px-4 text-left text-sm font-semibold border-b">No</th>
          <th class="py-2 px-4 text-left text-sm font-semibold border-b">Nama Barang</th>
          <th class="py-2 px-4 text-left text-sm font-semibold border-b">SKU</th>
          <th class="py-2 px-4 text-center text-sm font-semibold border-b">Qty</th>
        </tr>
      </thead>
      <tbody>
        {#each transaksi.items as item, i}
          <tr class="hover:bg-amber-50">
            <td class="py-2 px-4 border-b">{i + 1}</td>
            <td class="py-2 px-4 border-b">{item.item.name}</td>
            <td class="py-2 px-4 border-b">{item.item.sku}</td>
            <td class="py-2 px-4 text-center border-b">{item.qty}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>


{/if}

