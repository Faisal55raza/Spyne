import React, { Fragment, useState, useEffect } from "react";
import "./newCar.css"; // Reuse the same CSS
import { Button } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./loader"; // Ensure Loader is correctly imported
import axios from "axios";
import Notiflix from "notiflix";

const UpdateCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for token on initial render
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Notiflix.Notify.failure("You must be logged in to access this page.");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://secure-mae-na0w0-0a956918.koyeb.app/api/v1/car/details/${id}`);
        const { title, description, tags, images } = response.data.car;

        setTitle(title);
        setDescription(description);
        setTags(tags.join(", "));
        setTagsList(tags);
        setImages(images);
        setImagesPreview(images);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const updateCarSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updateData = {
      title,
      description,
      tags: tagsList,
      images, // Base64 images
    };

    const token = localStorage.getItem("token");

    if (!token) {
      Notiflix.Notify.failure("You must be logged in to update the car.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        `https://secure-mae-na0w0-0a956918.koyeb.app/api/v1/car/update/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Notiflix.Notify.success("Car updated successfully");
        navigate("/cars"); // Redirect to the cars page after successful update
      } else {
        setError(response.data.message || "Failed to update car.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred.");
      Notiflix.Notify.failure(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTags(value);

    const newTags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    setTagsList(newTags);
  };

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
        <Loader />
      ) : (
        <div className="newCarContainer">
          <form
            className="createCarForm"
            encType="multipart/form-data"
            onSubmit={updateCarSubmitHandler}
          >
            <h1>Update Car</h1>

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
              {loading ? "Updating..." : "Update"}
            </Button>
          </form>
        </div>
      )}
    </Fragment>
  );
};

export default UpdateCar;
