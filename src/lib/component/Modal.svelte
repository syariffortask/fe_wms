<script>
  import { fade, scale } from "svelte/transition";
  import { X } from "lucide-svelte";

  export let isOpen = false;
  export let onSave = () => {};
  export let fields = [];
  export let modalTitle = "";
  export let initialValues = {};
  export let variant = 2; // 🧱 jumlah grid md ke atas (1–3)

  let onClose = () => (isOpen = false);
  let formData = {};
  let errors = {};

  // ✅ Map variant → Tailwind class (harus eksplisit agar tidak error saat build)
  $: gridClass =
    {
      1: "grid grid-cols-1 md:grid-cols-1 gap-4",
      2: "grid grid-cols-1 md:grid-cols-2 gap-4",
      3: "grid grid-cols-1 md:grid-cols-3 gap-4",
    }[variant] || "grid grid-cols-1 md:grid-cols-2 gap-4";

  // Reset form setiap kali modal dibuka
  $: if (isOpen) {
    formData = {};
    errors = {};
    fields.forEach((field) => {
      formData[field.name] = initialValues[field.name] ?? field.default ?? "";
      errors[field.name] = "";
    });
  }

  const handleSubmit = () => {
    let hasError = false;

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = `${field.label} wajib diisi`;
        hasError = true;
      } else {
        errors[field.name] = "";
      }
    });

    if (!hasError) {
      const payload = { ...formData };
      fields.forEach((f) => {
        if (f.type === "number" && payload[f.name] === "") {
          payload[f.name] = null;
        }
      });

      onSave(payload);
      onClose();
    }
  };
</script>

{#if isOpen}
  <div
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    transition:fade
  >
    <div
      class="bg-white p-6 rounded-lg shadow-md w-full md:max-w-4xl space-y-4"
      transition:scale
    >
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
            <label
              for={field.name}
              class="text-xs md:text-sm font-medium text-gray-700 mb-1"
              >{field.label}</label
            >

            {#if field.type === "select"}
              <!-- 🧩 Input Select -->
              <select
                bind:value={formData[field.name]}
                class="w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-blue-500"
                required={field.required}
              >
                <option value="" disabled selected hidden>
                  {field.placeholder || "Pilih opsi"}
                </option>
                {#each field.options || [] as opt}
                  <option value={opt.value ?? opt}>
                    {opt.label ?? opt}
                  </option>
                {/each}
              </select>
            {:else}
              <!-- 🧩 Input Default -->
              <input
                type={field.type || "text"}
                bind:value={formData[field.name]}
                placeholder={field.placeholder}
                class="w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:border-blue-500 placeholder:text-xs"
                required={field.required}
              />
            {/if}

            {#if errors[field.name]}
              <p class="text-xs text-red-500 mt-1">{errors[field.name]}</p>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-2 pt-4 border-t">
        <button
          on:click={onClose}
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
        >
          Batal
        </button>
        <button
          on:click={handleSubmit}
          class="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
{/if}
