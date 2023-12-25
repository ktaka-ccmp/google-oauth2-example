<script>
  import { Router, Link, Route } from "svelte-routing";
  import Top from "./components/Top.svelte";
  import Customer from "./components/Customer.svelte";
  import NoMatch from "./components/NoMatch.svelte";
  import LoginPage from "./components/LoginPage.svelte";

  export let url = "";
</script>

<div class="container-sm">
  <Router {url}>
    <nav>
      <table class="table-borderless table-responsive">
        <tbody>
          <tr><td><Link to="/">Top</Link></td></tr>
          <tr><td><Link to="/customer">Customer</Link></td></tr>
        </tbody>
      </table>
    </nav>

    <div>
      <Route path="/"><Top /></Route>
      <Route path="/customer"><Customer /></Route>
      <Route path="/login"><LoginPage /></Route>
      <Route path="*"><NoMatch /></Route>
    </div>
  </Router>
</div>

<style>
</style>
