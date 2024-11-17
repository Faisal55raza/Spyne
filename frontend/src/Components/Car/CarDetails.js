import React, { Fragment, useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import "./CarDetails.css"; // Keep it if required for other styles
import Loader from "./loader";
import Notiflix from 'notiflix';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://secure-mae-na0w0-0a956918.koyeb.app/api/v1/car/delete/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
      });

      if (!response.ok) {
        throw new Error("Failed to delete the car");
      }

      alert("Car deleted successfully");
      navigate("/cars");
      // Optionally, redirect the user to another page
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  const handleUpdate = () => {
    // Navigate to an update form or open a modal
    navigate(`/updateCar/${id}`)
  };

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`https://secure-mae-na0w0-0a956918.koyeb.app/api/v1/car/details/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch car details");
        }
        const data = await response.json();
        setCar(data.car);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  // Get the user ID from local storage
  const loggedInUserId = localStorage.getItem("userId");

  return (
    <Fragment>
      <div className="CarDetails p-4">
        <div className="shadow-xl rounded-md bg-white p-4 mb-6">
          <Carousel>
            {car.images &&
              car.images.map((image, i) => (
                <img
                  className="w-full h-64 object-cover rounded-md"
                  key={i}
                  src={image}
                  alt={`Slide ${i + 1}`}
                />
              ))}
          </Carousel>
        </div>
        <div className="shadow-xl rounded-md bg-white p-6">
          <div className="detailsBlock-1 mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">{car.title}</h2>
            <p className="text-sm text-gray-500">Car ID: {car._id}</p>
          </div>
          <div className="detailsBlock-4 mb-4">
            <h3 className="text-lg font-medium text-gray-700">Description</h3>
            <p className="text-gray-600">{car.description}</p>
          </div>
          <div className="detailsBlock-5 mb-6">
            <h3 className="text-lg font-medium text-gray-700">Tags</h3>
            {car.tags && car.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {car.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tags available</p>
            )}
          </div>
          {/* Show buttons only if the logged-in user matches the car's owner and none are null */}
          {car?.user && loggedInUserId && car.user === loggedInUserId && (
            <div className="actions flex gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-200"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition duration-200"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default CarDetails;
