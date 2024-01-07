import { useState, useMemo, useContext } from 'react';
import { Table } from 'reactstrap';
import { AuthContext } from './AuthProvider'

const CustomerTable = ({ items, loading }) => {
    if (loading) {
	return <h2>Loading...</h2>;
    }
    return(
	<Table bordered hover striped responsive>
	    <thead>
		<tr>
		    <th>id</th>
		    <th>name</th>
		    <th>email</th>
		</tr>
	    </thead>
	    <tbody>
		{items.map(cs =>
		    <tr key={cs.id}>
			<td>{cs.id}</td>
			<td>{cs.name}</td>
			<td>{cs.email}</td>
		    </tr>
		)}
	    </tbody>
	</Table>
    );
}

const CustomerList = () => {
    
    const { apiAxios } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

	useMemo(async () => {
		setLoading(true);
		try {
			await new Promise(r => setTimeout(r, 1000))
			const res = await apiAxios.get(`/api/customer/`)
			setItems(res.data.results);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, [apiAxios]);

    return (
	<div >
	    <h1 className='text-primary'>Customer List</h1>
	    <CustomerTable items={items} loading={loading} />
	</div>
    );
};

export default CustomerList;
