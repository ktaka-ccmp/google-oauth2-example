<script>
  import { onMount } from "svelte";
  import { apiAxios } from "../lib/apiAxios";
  import LogoutButton from "./LogoutButton.svelte";

  let customers = [];
  let Loading = true;

  onMount(async () => {
    try {
        await new Promise(r => setTimeout(r, 1000))

        let res = await apiAxios.get(`/api/customer/`);
        customers = res.data.results;
        console.log("axios:", customers[0]);
    } catch(error){
        console.log("axios error:", error);
    } finally {
      Loading = false;
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
