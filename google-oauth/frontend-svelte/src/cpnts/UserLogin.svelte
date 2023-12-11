<script>
  import { onMount } from "svelte";
  import { apiAxios } from "../lib/apiAxios";

  import { useLocation, navigate } from "svelte-routing";

  let location = useLocation();
  // let origin = "";
  let origin = $location.state?.from;
  // $: console.log("Current:", $location.state?.from);
  // $: console.log("Origin:", origin);

  const backendAuth = (response) => {
    const data = JSON.stringify(response, null, 2);
    console.log("JWT fed to backendAuth:\n", data);

    apiAxios
      .post(`/api/login/`, data)
      .then((res) => {
        console.log("BackendAuth response:\n", res);
        console.log("Navigate back to: ", origin);
        navigate(origin, { replace: true });
      })
      .catch((error) => {
        console.log("backendAuth", error);
        console.log("backendAuth failed. Redirecting to /login... ");
      });
  };
  const onLogin = backendAuth;

  onMount(() => {

    google.accounts.id.initialize({
      /* global google */
      client_id: import.meta.env.VITE_APP_GOOGLE_OAUTH2_CLIENT_ID,
      callback: (r) => onLogin(r),
      ux_mode: "popup",
      //	    ux_mode: "redirect",
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "filled_blue",
      size: "large",
      shape: "circle",
    });

    google.accounts.id.prompt();
  });
</script>

<main>
  <h2>Login page</h2>
  <div id="signInDiv"></div>
</main>
