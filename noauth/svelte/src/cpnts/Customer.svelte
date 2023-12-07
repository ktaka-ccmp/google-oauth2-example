<script>
    import { onMount } from "svelte";
    import axios from "axios";

    let users = [];
    
    console.log(import.meta.env.VITE_APP_API_SERVER)

    onMount(async () => {
    const res = await axios.get(`${import.meta.env.VITE_APP_API_SERVER}/api/customer/`);
    users = res.data.results;
    console.log("axios:", users);
    });

</script>


<h2>This is Customer.</h2>

{#await users}
<p>Loading ...</p>
{:then users}
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
                {#each users as cs}
                <tr>
                    <td>{cs.id}</td>
                    <td>{cs.name}</td>
                    <td>{cs.email}</td>
                </tr>
                {/each}
            </tbody>
    </table>
</div>
{/await}