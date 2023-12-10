<script>
  import { Router, Link, Route } from "svelte-routing";
  import Top from "./cpnts/Top.svelte";
  import Customer from "./cpnts/Customer.svelte";
  import NoMatch from "./cpnts/NoMatch.svelte";
  import UserLogin from "./cpnts/UserLogin.svelte";
  import UserLogout from "./cpnts/UserLogout.svelte";

  export let url = "";
</script>

<div class="container-sm">
  <Router {url}>
    <nav>
      <table class="table-borderless table-responsive">
        <tbody>
          <tr><td><Link to="/">Top</Link></td></tr>
          <tr><td><Link to="/customer">Customer</Link></td></tr>
          <!-- <tr><td><Link to="/login">Login</Link></td></tr>
          <tr><td><Link to="/logout">Logout</Link></td></tr> -->
        </tbody>
      </table>
    </nav>

    <div>
      <Route path="/"><Top /></Route>
      <Route path="/customer"><Customer /></Route>
      <Route path="/login"><UserLogin /></Route>
      <Route path="/logout"><UserLogout /></Route>
      <Route path="*"><NoMatch /></Route>
    </div>
  </Router>
</div>

<style>
</style>
