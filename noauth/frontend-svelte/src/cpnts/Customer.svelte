<script>
    import { onMount } from "svelte";
    import axios from "axios";

    let users = [];
    let Loading = true;

    console.log(import.meta.env.VITE_APP_API_SERVER)

    onMount(async () => {
        await new Promise(r => setTimeout(r, 1000))
        await axios.get(`${import.meta.env.VITE_APP_API_SERVER}/api/customer/`)
        .then((res) => {
            users = res.data.results
            console.log("axios:", users);
            Loading = false;
        })
        .catch((err) => {
            console.log("axios err:", err);
        });
    });

</script>

<h2>This is Customer.</h2>

{#if Loading }
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
{/if}