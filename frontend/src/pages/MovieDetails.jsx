import React from "react";
import { useParams } from "react-router-dom";

const MovieDetails = () => {
  const { id } = useParams();
  return <h1>Movie Details — ID: {id}</h1>;
};

export default MovieDetails;