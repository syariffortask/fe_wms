<script>
  import { fade, scale } from "svelte/transition";
  import { X, Plus, Trash2, CheckSquare, Square } from "lucide-svelte";

  export let isOpen = false;
  export let onSave = () => {};
  export let fields = [];
  export let modalTitle = "";
  export let initialValues = {};
  export let barangOptions = [];
  export let variant = 2;

  let onClose = () => (isOpen = false);
  let formData = {};
  let errors = {};
  let items = [{ item_id: "", qty: 1 }];
  let allSelected = false; // toggle Pilih Semua

  $: gridClass =
    {
      1: "grid grid-cols-1 md:grid-cols-1 gap-4",
      2: "grid grid-cols-1 md:grid-cols-2 gap-4",
      3: "grid grid-cols-1 md:grid-cols-3 gap-4",
    }[variant] || "grid grid-cols-1 md:grid-cols-2 gap-4";

  // Reset saat modal dibuka
  $: if (isOpen) {
    formData = {};
    errors = {};
    items = [{ item_id: "", qty: 1 }];
    allSelected = false;

    fields.forEach((field) => {
      formData[field.name] = initialValues[field.name] ?? field.default ?? "";
      errors[field.name] = "";
    });
  }

  // Tambah barang baru di atas
  function addItem() {
    items = [{ item_id: "", qty: 1 }, ...items];
    setTimeout(() => {
      const container = document.getElementById("barangList");
      if (container) container.scrollTop = 0;
    }, 0);
  }

  // Hapus item tertentu
  function removeItem(index) {
    items = items.filter((_, i) => i !== index);
  }

  // Pilih semua barang (toggle)
  function toggleSelectAll() {
    if (!allSelected) {
      // tambahkan semua barang ke items
      items = barangOptions.map((b) => ({ item_id: b.value, qty: 1 }));
      allSelected = true;
    } else {
      // kosongkan
      items = [{ item_id: "", qty: 1 }];
      allSelected = false;
    }

    // scroll ke atas
    setTimeout(() => {
      const container = document.getElementById("barangList");
      if (container) container.scrollTop = 0;
    }, 0);
  }

  // Submit
  function handleSubmit() {
    let hasError = false;

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} wajib diisi`;
        hasError = true;
      } else {
        errors[field.name] = "";
      }
    });

    if (items.some((it) => !it.item_id || it.qty <= 0)) {
      alert("Pastikan semua barang dan jumlah sudah diisi dengan benar!");
      return;
    }

    if (!hasError) {
      const payload = {
        trx_type: formData["Jenis"],
        note: formData["Note"],
        items: items.map((it) => ({
          item_id: Number(it.item_id),
          qty: Number(it.qty),
        })),
      };

      onSave(payload);
      onClose();
    }
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" transition:fade>
    <div class="bg-white p-6 rounded-lg shadow-md w-full md:max-w-4xl space-y-4 max-h-[90vh] overflow-y-auto" transition:scale>
      <!-- Header -->
      <div class="flex justify-between items-center border-b pb-2">
        <h2 class="text-lg font-semibold">{modalTitle}</h2>
        <button on:click={onClose} class="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <!-- Form Grid -->
      <div class={gridClass}>
        {#each fields as field}
          <div class="flex flex-col">
            <label for={field.name} class="text-xs md:text-sm font-medium text-gray-700 mb-1">{field.label}</label>

            {#if field.type === "select"}
              <select bind:value={formData[field.name]} class="w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-blue-500" required={field.required}>
                <option value="" disabled selected hidden>
                  {field.placeholder || "Pilih opsi"}
                </option>
                {#each field.options || [] as opt}
                  <option value={opt.value}>{opt.label}</option>
                {/each}
              </select>
            {:else}
              <input type={field.type || "text"} bind:value={formData[field.name]} placeholder={field.placeholder} class="w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-blue-500 placeholder:text-xs" required={field.required}/>
            {/if}

            {#if errors[field.name]}
              <p class="text-xs text-red-500 mt-1">{errors[field.name]}</p>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Barang Dinamis -->
      <div class="mt-4 border-t pt-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-semibold">Daftar Barang:</p>
          <div class="flex items-center gap-2">
            <button type="button" on:click={toggleSelectAll} class="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm">
              {#if allSelected}
                <CheckSquare size={16} /> Batalkan Pilih Semua
              {:else}
                <Square size={16} /> Pilih Semua Barang
              {/if}
            </button>
            <button type="button" on:click={addItem} class="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm">
              <Plus size={16} /> Tambah Barang
            </button>
          </div>
        </div>

        <!-- Scrollable list container -->
        <div id="barangList" class="max-h-64 overflow-y-auto space-y-2 pr-1 border rounded-md p-2 bg-gray-50">
          {#each [...items].reverse() as item, i}
            <div class="flex items-center gap-2 bg-white hover:shadow-sm">
              <select bind:value={item.item_id} class="flex-1 px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-blue-500">
                <option value="" disabled selected hidden>Pilih Barang</option>
                {#each barangOptions as opt}
                  <option value={opt.value}>{opt.label}</option>
                {/each}
              </select>
              <input type="number" min="1" bind:value={item.qty} class="w-24 px-2 py-2 border rounded-md text-sm text-center"/>
              {#if items.length > 1}
                <button on:click={() => removeItem(items.length - 1 - i)} type="button" class="p-2 text-red-600 hover:bg-red-100 rounded">
                  <Trash2 size={16} />
                </button>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-2 pt-4 border-t">
        <button on:click={onClose} class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded">
          Batal
        </button>
        <button on:click={handleSubmit} class="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded">
          Simpan
        </button>
      </div>
    </div>
  </div>
{/if}
