<script>
  import { onMount } from "svelte";
  import { apiAxios } from "../lib/apiAxios";
  import UserLogout from "./UserLogout.svelte";

  let users = [];

  const getUser = () => {
    apiAxios
      .get(`/api/user/`)
      .then((res) => {
        user = res.data;
        console.log("getUser: user:", user);
      })
      .catch((error) => console.log("getUser faild: ", error.response));
  };

  const getCustomers = async () => {
    await apiAxios
      .get(`/api/customer/`)
      .then((res) => {
        users = res.data.results;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onMount(async () => {
    getCustomers();
  });
</script>

<UserLogout />
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
