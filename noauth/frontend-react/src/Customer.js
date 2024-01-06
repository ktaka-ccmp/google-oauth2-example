import { useState, useMemo, useContext } from 'react';
import axios from 'axios';

import { Table } from 'reactstrap';

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
    
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useMemo(() => {
	// const fetchItems = async () => {
	async function fetchItems() {
	    setLoading(true);
		try {
		    let res = await axios.get(`${process.env.REACT_APP_API_SERVER}/api/customer/`)
		    setItems(res.data.results);
		    setLoading(false);
		} catch (error) {
		    console.log(error);
		}
	};

	fetchItems();
    }, []);

    return (
	<div >
	    <h1 className='text-primary'>Customer List</h1>
	    <CustomerTable items={items} loading={loading} />
	</div>
    );
};

export default CustomerList;
