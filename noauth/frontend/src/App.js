import { Routes, Route, Link } from 'react-router-dom';
import Customer from './Customer';
import { Table, Container } from 'reactstrap';

const NoMatch = () => {
    return <h2>Page doesn't exist.</h2>;
}

const Top = () => {
    return <h2>This is top page.</h2>;
}

const App = () => {
  return (
      <div>
	  <Container fluid="sm">
	      <Table borderless responsive size="sm">
		  <tbody>
		      <tr><td><Link to={`/`}>Top</Link></td></tr>
		      <tr><td><Link to={`/customer`}>Customer</Link></td></tr>
		  </tbody>
	      </Table>
	      
	      <Routes>
		  <Route index element={ <Top /> } />
		  <Route path="/customer" element={ <Customer /> } />
		  <Route path="*" element={<NoMatch />} />
	      </Routes>
	  </Container>
      </div>
  );
}

export default App;
