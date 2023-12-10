<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import { apiAxios } from "../lib/apiAxios.js";

  let user;

  onMount(() => {
    console.log("Logout Component Mounted");
    getUser();
  });

  const handleLogout = () => {
    user = null;
    apiAxios
      .get(`/api/logout/`)
      .then((res) => {
        console.log("backendLogout", res);
        getUser();
      })
      .catch((error) => console.log("Logout failed: ", error));
  };

  const getUser = () => {
    apiAxios
      .get(`/api/user/`)
      .then((res) => {
        user = res.data;
        console.log("getUser: user:", user);
      })
      .catch((error) => console.log("getUser faild: ", error.response));
  };

  const onLogout = handleLogout;
</script>

<div>
  Authenticated as {user?.username} &nbsp;
  <button type="button" on:click={onLogout}>Sign Out</button>
</div>
