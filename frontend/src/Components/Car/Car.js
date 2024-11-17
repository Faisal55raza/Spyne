import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Products.css";
import Loader from "./loader"
import ProductCard from "./CarCard";
import Notiflix from 'notiflix';
import Search from "./Search";



const Products = () => {
  const { keyword } = useParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let url = "https://secure-mae-na0w0-0a956918.koyeb.app/api/v1/car/all"; // Base URL

        if (keyword) {
          url += `?search=${keyword}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data.cars);
      
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    

    fetchProducts();
  }, [keyword]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
  
          <Search />
          <div className="back">
            <h2 className="productsHeading">CARS</h2>

            <div className="products">
              {error ? (
                <p>{error}</p>
              ) : (
                products && products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
