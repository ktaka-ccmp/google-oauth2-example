import { Routes, Route, Link } from 'react-router-dom';
import { Table, Container } from 'reactstrap';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Customer from './Customer';
import { AuthProvider, LogoutButton, UserLogin, RequireAuth } from './AuthProvider'

const NoMatch = () => {
    return <h2>Page does not exist.</h2>;
}

const Top = () => {
    return <h2>This is top page.</h2>;
}

const App = () => {
  return (
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID}>
      <AuthProvider>
	  <Container fluid="sm">
	      <Table borderless responsive size="sm">
		  <tbody>
		      <tr><td><Link to={`/`}>Top</Link></td></tr>
		      <tr><td><Link to={`/customer`}>Customer</Link></td></tr>
		  </tbody>
	      </Table>

	      <LogoutButton />

	      <Routes>
		  <Route index element={ <Top /> } />
		  <Route path="/login" element={<UserLogin />} />
		  <Route element={<RequireAuth />}>
		      <Route path="/customer" element={ <Customer /> } />
		  </Route>
		  <Route path="*" element={<NoMatch />} />
	      </Routes>
	  </Container>
      </AuthProvider>
      </GoogleOAuthProvider>
  );
}

export default App;
