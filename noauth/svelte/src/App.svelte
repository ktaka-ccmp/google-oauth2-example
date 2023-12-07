<script>
    import { Router, Link, Route } from "svelte-routing";
    import Top from "./cpnts/Top.svelte";
    import Customer from "./cpnts/Customer.svelte";
    import NoMatch from "./cpnts/NoMatch.svelte";

    export let url = "";
</script>

<main>
    <Router {url}>
        <nav>
          <Link to="/">Top</Link>
          <Link to="/customer">Customer</Link>
        </nav>
        <div>
          <Route path="/"><Top /></Route>
          <Route path="/customer"><Customer /></Route>
          <Route path="*"><NoMatch /></Route>
        </div>
      </Router>
</main>




<style>

</style>
