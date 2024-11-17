import React, { Fragment, useState, useEffect } from "react";
import "./newCar.css";
import { Button } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import { useNavigate } from "react-router-dom";
import Loader from "./loader"; // Ensure Loader is correctly imported
import axios from "axios";
import Notiflix from 'notiflix';

const NewCar = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Notiflix.Notify.failure("You must be logged in to create a car.");
      navigate("/login"); // Redirect to login page if no token is found
    }
  }, []); // Empty dependency array to run only once when component mounts

  useEffect(() => {
    if (error) {
      console.error(error);
    }

    if (success) {
      navigate("/cars"); // Redirect to the cars page after successful creation
    }
  }, [error, success, navigate]);

  // Handle form submission
  const createCarSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data for submission
    const postData = {
      title,
      description,
      tags: tagsList, // Send the parsed tags array
      images, // Base64 images
    };

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://secure-mae-na0w0-0a956918.koyeb.app/api/v1/car/create",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        setError("");
      } else {
        setSuccess(false);
        setError(response.data.message || "Failed to create car.");
      }
    } catch (err) {
      setSuccess(false);
      setError(err.response?.data?.message || err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle tag changes
  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTags(value);

    // Update tagsList dynamically
    const newTags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    setTagsList(newTags);
  };

  // Handle image file changes
  // Handle image file changes
const handleImageFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files);

  // Check if the number of selected files exceeds 10
  if (selectedFiles.length + images.length > 10) {
    Notiflix.Notify.failure("You can upload a maximum of 10 images.");
    return; // Do not proceed if the limit is exceeded
  }

  setImages([]); // Reset the current images array before adding new images
  setImagesPreview([]); // Reset the preview array before adding new previews

  selectedFiles.forEach((file) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const base64Image = fileReader.result;
        setImagesPreview((prevImages) => [...prevImages, base64Image]);
        setImages((prevFiles) => [...prevFiles, base64Image]);
      }
    };

    fileReader.readAsDataURL(file);
  });
};


  return (
    <Fragment>
      {loading ? (
        <Loader /> // Render Loader component when loading is true
      ) : (
        <div className="newCarContainer">
          <form
            className="createCarForm"
            encType="multipart/form-data"
            onSubmit={createCarSubmitHandler}
          >
            <h1>Create Car</h1>

            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Car Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <DescriptionIcon />
              <textarea
                placeholder="Car Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={handleTagsChange}
              />
            </div>

            {tagsList.length > 0 && (
              <div className="tagsPreview">
                <h3>Tags:</h3>
                <ul>
                  {tagsList.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
            )}

            <div id="createCarFormFile">
              <input
                type="file"
                name="carImages"
                accept="image/*"
                onChange={handleImageFileChange}
                multiple
              />
            </div>

            <div id="createCarFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Car Preview" />
              ))}
            </div>

            <Button id="createCarBtn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </form>
        </div>
      )}
    </Fragment>
  );
};

export default NewCar;
