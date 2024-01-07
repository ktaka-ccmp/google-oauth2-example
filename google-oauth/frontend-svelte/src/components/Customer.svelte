<script>
  import { onMount } from "svelte";
  import { apiAxios } from "../lib/apiAxios";
  import LogoutButton from "./LogoutButton.svelte";

  let customers = [];
  let Loading = true;
  console.log(import.meta.env.VITE_APP_API_SERVER)

onMount(async () => {
    try {
        await new Promise(r => setTimeout(r, 3000))

        let res = await apiAxios.get(`${import.meta.env.VITE_APP_API_SERVER}/api/customer/`);
        customers = res.data.results;
        console.log("axios:", customers[0]);
        Loading = false;
    } catch(error){
        console.log("axios error:", error);
    }
});

</script>

<LogoutButton />
<h2>This is Customer.</h2>

{#if Loading}
  <p>Loading ...</p>
{:else}
  <div class="table-responsive">
    <table class="table table-bordered table-hover table-striped">
      <thead class="table-light">
        <tr>
          <th>id</th>
          <th>name</th>
          <th>email</th>
        </tr>
      </thead>
      <tbody>
        {#each customers as cs}
          <tr>
            <td>{cs.id}</td>
            <td>{cs.name}</td>
            <td>{cs.email}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
