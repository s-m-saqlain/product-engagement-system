import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProductList from '../components/ProductList';
import AdminPanel from '../components/AdminPanel';

function Home() {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div>
            {user.role === 'admin' ? <AdminPanel /> : <ProductList />}
          </div>
    );
}

export default Home;