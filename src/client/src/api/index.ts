import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:5183",
});

export const subscribe = ({
  movieTitle,
  email,
}: {
  movieTitle: string;
  email: string;
}) => {
  return client.post("/subscribe", {
    movieTitle,
    email,
  });
};

export const getRecentMovies = () => {
  return client.get("/recent-movies").then(({ data }) => data);
};

export const generateDownloadLink = (url: string) => {
  return client
    .post("/generateDownloadLink", { url })
    .then((res) => res.data.data);
};
