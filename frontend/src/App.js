import { Routes, Route, Link } from 'react-router-dom';
import Customer from './Customer';
import { Table, Container } from 'reactstrap';

import {
    AuthProvider,
    UserLogout,
    UserLogin,
    RequireAuth,
} from './AuthProvider'

const NoMatch = () => {
    return <h2>Page does not exist.</h2>;
}

const Top = () => {
    return <h2>This is top page.</h2>;
}

const App = () => {
  return (
      <AuthProvider>
	  <div>
	  <Container fluid="sm">
	      <Table borderless responsive size="sm">
		  <tbody>
		      <tr><td><Link to={`/`}>Top</Link></td></tr>
		      <tr><td><Link to={`/customer`}>Customer</Link></td></tr>
		      {/*
		      <tr><td><Link to={`/login`}>Login</Link></td></tr>
		       */}
		  </tbody>
	      </Table>
	      <UserLogout />

	      <Routes>
		  <Route index element={ <Top /> } />
		  <Route path="/login" element={<UserLogin />} />
		  <Route element={<RequireAuth />}>
		      <Route path="/customer" element={ <Customer /> } />
		  </Route>
		  <Route path="*" element={<NoMatch />} />
	      </Routes>
	  </Container>
	  </div>
      </AuthProvider>
  );
}

export default App;
