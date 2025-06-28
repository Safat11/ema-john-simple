import { useState } from 'react';
import './Shop.css'
import { useEffect } from 'react';
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import { Link, useLoaderData } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [cart, setCart] = useState([])
    const { totalProducts } = useLoaderData();


    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    const pagesNumbers = [...Array(totalPages).keys()];

    

    /**
     * DONE: 1. Determine the total number of items:
     * TODO: 2. Decide on the number of items per page:
     * DONE: 3. Calculate the total number of pages:
     * DONE: 4. Determine the current page:
    */

/*     useEffect(() => {

        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, []);
 */

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`http://localhost:5000/products?pages=${currentPage}&limit=${itemsPerPage}`);
            const data = await response.json();
            setProducts(data)
        }
        fetchData();
    }, [currentPage, itemsPerPage])

    useEffect(() => {

        const storedCart = getShoppingCart();
        const savedCart = [];
        //step 1: get id
        for (const id in storedCart) {
            // step 2: get the product by using id
            const addedProduct = products.find(product => product._id === id);

            // step 3: get quantity of the product
            if (addedProduct) {
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                // step 4: add the added product to the saved cart
                savedCart.push(addedProduct);
            }
            //console.log('added Product', addedProduct)
        }
        // step 5: set the cart
        setCart(savedCart);
    }, [products])

    const handleAddToCart = (product) => {
        //cart.push(product)
        const newCart = [...cart, product];
        setCart(newCart);

        addToDb(product._id);
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const options = [5, 10, 15, 20];
    function handleSelectChange(event) {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(0);
    }

    return (
        <>
            <div className='shop-container'>
                <div className="products-container">
                    {
                        products.map(product => <Product
                            key={product._id}
                            product={product}
                            handleAddToCart={handleAddToCart}
                        ></Product>)
                    }
                </div>
                <div className="cart-container">
                    <Cart
                        cart={cart}
                        handleClearCart={handleClearCart}
                    >
                        <Link className='proceed-link' to='/orders'>
                            <button className='btn-proceed'>Review Order
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </Link>
                    </Cart>
                </div>

            </div>
            {/* pagination */}
            <div className="pagination">
                <p>Current Page: {currentPage}  And Items Per Page: {itemsPerPage}</p>
                {
                    pagesNumbers.map(number => <button
                        key={number}
                        className={currentPage === number ? 'selected' : ''}
                        onClick={() => setCurrentPage(number)}
                    >{number}</button>)
                }
                <select value={itemsPerPage} onChange={handleSelectChange}>
                    {
                        options.map(option => (<option key={option} value={option}>
                            {option}
                        </option>))
                    }
                </select>
            </div>
        </>
    );
};

export default Shop;