<script>
  import { onMount } from "svelte";
  import {
    fetchBarang,
    createBarang,
    deleteBarang,
    updateBarang,
  } from "$lib/api/barang";
  import AuthGuard from "$lib/component/AuthGuard.svelte";
  import Modal from "$lib/component/Modal.svelte";
  import { alertSuccess, alertError, alertConfirm } from "$lib/alert";

  let barang = [];
  let searchTerm = "";
  let currentPage = 1;
  let showModal = false;
  let showEditModal = false;
  let selectedItem = null;
  const fields = [
    { name: "name", label: "Nama Barang", required: true },
    { name: "sku", label: "SKU", required: true },
    { name: "rack", label: "Rak", required: true },
  ];
  const itemsPerPage = 10;

  let sortField = "name";
  let sortOrder = "asc";

  onMount(async () => {
    barang = await fetchBarang();
  });

  // filter pencarian
  $: filteredBarang = barang.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rack.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // sorting
  $: sortedBarang = [...filteredBarang].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // pagination
  $: totalPages = Math.ceil(sortedBarang.length / itemsPerPage);
  $: paginatedBarang = sortedBarang.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  function sortBy(field) {
    if (sortField === field) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      sortField = field;
      sortOrder = "asc";
    }
  }

  async function handleSave(data) {
    const response = await createBarang(data);
    // kasih alert kalo sukses
    if (response) alertSuccess("Berhasil", "Barang berhasil ditambahkan");
    barang = [...barang, response];
    showModal = false;
  }

  async function editButton(data) {
    // aktifkan modal edit
    showEditModal = true;
    selectedItem = data;
  }

  async function handleEdit(data) {
    const response = await updateBarang(selectedItem.id, data);
    // kasih alert kalo sukses
    if (response) alertSuccess("Berhasil", "Barang berhasil diubah");
    barang = barang.map((item) => {
      if (item.id === selectedItem.id) {
        return response;
      }
      return item;
    });
    showEditModal = false;
  }

  async function handleDelete(id) {
    // kasih alert warning dulu
    const result = await alertConfirm(
      "Peringatan",
      "Anda yakin ingin menghapus barang ini?"
    );
    if (result.isConfirmed) {
      const response = await deleteBarang(id);
      if (response) {
        alertSuccess("Berhasil", "Barang berhasil dihapus");
        barang = barang.filter((item) => item.id !== id);
      } else {
        alertError("Gagal", "Barang gagal dihapus");
      }
    }
  }
</script>

<AuthGuard allowRole={["admin"]} />

<!-- Input Pencarian -->
<div class="mb-6 flex items-center justify-between">
  <button
    on:click={() => (showModal = true)}
    class="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-sm"
    >Tambah</button
  >
  <input
    type="text"
    placeholder="🔍 Cari barang..."
    bind:value={searchTerm}
    class="border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 rounded-lg px-4 py-2 m:w-full shadow-sm"
  />
</div>

<!-- Table Container -->
<div
  class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
>
  <table class="min-w-full text-sm">
    <thead
      class="bg-gradient-to-r from-amber-500 to-amber-600 text-white uppercase text-xs"
    >
      <tr>
        <th class="p-3 text-left">No</th>
        <th
          class="p-3 text-left cursor-pointer select-none"
          on:click={() => sortBy("sku")}
        >
          SKU {#if sortField === "sku"}<span
              >{sortOrder === "asc" ? "▲" : "▼"}</span
            >{/if}
        </th>
        <th
          class="p-3 text-left cursor-pointer select-none"
          on:click={() => sortBy("name")}
        >
          Nama Barang {#if sortField === "name"}<span
              >{sortOrder === "asc" ? "▲" : "▼"}</span
            >{/if}
        </th>
        <th
          class="p-3 text-left cursor-pointer select-none"
          on:click={() => sortBy("stock")}
        >
          Stok {#if sortField === "stock"}<span
              >{sortOrder === "asc" ? "▲" : "▼"}</span
            >{/if}
        </th>
        <th
          class="p-3 text-left cursor-pointer select-none"
          on:click={() => sortBy("rack")}
        >
          Rak {#if sortField === "rack"}<span
              >{sortOrder === "asc" ? "▲" : "▼"}</span
            >{/if}
        </th>
        <th
          class="p-3 text-left cursor-pointer select-none"
          on:click={() => sortBy("created_at")}
        >
          Dibuat {#if sortField === "created_at"}<span
              >{sortOrder === "asc" ? "▲" : "▼"}</span
            >{/if}
        </th>
        <th
          class="p-3 text-left cursor-pointer select-none"
          on:click={() => sortBy("updated_at")}
        >
          Diubah {#if sortField === "updated_at"}<span
              >{sortOrder === "asc" ? "▲" : "▼"}</span
            >{/if}
        </th>
        <th class="p-3 text-left">Aksi</th>
      </tr>
    </thead>

    <tbody class="divide-y divide-gray-100">
      {#if paginatedBarang.length === 0}
        <tr>
          <td colspan="6" class="text-center p-6 text-gray-500"
            >Tidak ada data ditemukan</td
          >
        </tr>
      {:else}
        {#each paginatedBarang as item, i}
          <tr class="hover:bg-blue-50 transition">
            <td class="p-3 text-gray-700"
              >{(currentPage - 1) * itemsPerPage + i + 1}</td
            >
            <td class="p-3 font-mono text-gray-700">{item.sku}</td>
            <td class="p-3 text-gray-800 font-medium">{item.name}</td>
            <td class="p-3 text-gray-700">{item.stock}</td>
            <td class="p-3 text-gray-700">{item.rack}</td>
            <td class="p-3 text-gray-700">
              {item.created_at
                .replace("T", "-") // ganti T jadi -
                .replace(/(\.\d{2})\d+/, "$1")}
              <!-- potong milidetik setelah 2 digit -->
            </td>
            <td class="p-3 text-gray-700">
              {item.updated_at
                .replace("T", "-") // ganti T jadi -
                .replace(/(\.\d{2})\d+/, "$1")}
              <!-- potong milidetik setelah 2 digit -->
            </td>
            <td>
              <button
                class="bg-amber-500 px-2 hover:bg-amber-600 text-white rounded-md"
                on:click={() => editButton(item)}
              >
                Edit
              </button>
              <button
                on:click={() => handleDelete(item.id)}
                class="bg-red-500 px-2 hover:bg-red-800 text-white rounded-md"
              >
                Hapus
              </button>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<!-- Pagination -->
<div class="flex items-center justify-between mt-6">
  <div class="text-sm text-gray-600">
    Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(
      currentPage * itemsPerPage,
      sortedBarang.length
    )} dari {sortedBarang.length} data
  </div>
  <div class="flex items-center space-x-2">
    <button
      on:click={prevPage}
      disabled={currentPage === 1}
      class="px-2 bg-amber-500 text-white rounded-sm hover:bg-amber-600 disabled:opacity-50"
    >
      Prev
    </button>
    <span class="text-gray-700 font-medium">{currentPage}/{totalPages}</span>
    <button
      on:click={nextPage}
      disabled={currentPage === totalPages}
      class="px-2 bg-amber-500 text-white rounded-sm hover:bg-amber-600 disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>

<Modal
  modalTitle="Tambah Barang"
  {fields}
  variant={1}
  onSave={handleSave}
  bind:isOpen={showModal}
  on:submit={handleSubmit}
  on:cancel={handleCancel}
/>

<Modal
  modalTitle="Edit Barang"
  {fields}
  variant={1}
  initialValues={selectedItem}
  onSave={handleEdit}
  bind:isOpen={showEditModal}
  on:submit={handleSubmit}
  on:cancel={handleCancel}
/>
