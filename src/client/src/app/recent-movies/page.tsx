"use client";
import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  Image,
  Text,
  Grid,
  SimpleGrid,
  Button,
  Loader,
} from "@mantine/core";
import * as $api from "@/src/api";

const MovieCard = ({ movie }: { movie: any }) => {
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [generatingLink, setGeneratingLink] = useState(false);

  const generateDownloadLink = async () => {
    try {
      setGeneratingLink(true);
      let links = await $api.generateDownloadLink(movie.link);
      setDownloadLinks(links);
    } catch (err) {
    } finally {
      setGeneratingLink(false);
    }
  };

  const linksGenerated = generatingLink === false && downloadLinks.length > 0;

  return (
    <div key={movie.link}>
      <Card shadow="sm" padding="xl">
        <Card.Section>
          <Image
            src={movie.poster}
            height={160}
            alt="No way!"
            withPlaceholder
            placeholder={<Text align="center">cannot load image</Text>}
          />
        </Card.Section>

        <Text weight={500} size="lg" mt="md">
          {movie.title}
        </Text>

        <Text mt="xs" color="dimmed" size="sm" style={{ marginBottom: 25 }}>
          {movie.synopsis}
        </Text>

        {linksGenerated ? (
          <ul>
            {downloadLinks.map((link, index) => (
              <li key={`download-link-${index}`}>
                <a href={link} target="_blank">
                  {link}
                </a>
              </li>
            ))}

            <style jsx>
              {`
                ul {
                  list-style: none;
                }
              `}
            </style>
          </ul>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                loading={generatingLink === true}
                onClick={generateDownloadLink}
              >
                generate download link
              </Button>
            </div>
            {generatingLink === true && (
              <div
                style={{
                  marginTop: 8,
                  textAlign: "center",
                  fontSize: 14,
                  color: "gray",
                }}
              >
                Please exercise some patience, this would take a while
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
export default function RecentMovies() {
  const [movies, setMovies] = useState([]);
  const [errorLoadingMovies, setErrorLoadingMovies] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    $api
      .getRecentMovies()
      .then(({ data }) => {
        setMovies(data);
      })
      .catch((err) => {
        console.log("error --", err);
        setErrorLoadingMovies(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <Grid justify="center">
        <Grid.Col sm={6}>
          <h1 className="text-center mb-0">Recent movies</h1>
          <Text align="center" size="sm" className="mb-8">
            Source: tfpdl
          </Text>

          {loading ? (
            <div
              style={{
                padding: "50px 0",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Loader />
            </div>
          ) : errorLoadingMovies ? (
            <Alert style={{ textAlign: "center" }}>
              Ahh sorry, ann error occured loading movies
            </Alert>
          ) : (
            <SimpleGrid spacing="xl">
              {movies && movies.length > 0
                ? movies.map((movie: any) => {
                    return <MovieCard key={movie.link} movie={movie} />;
                  })
                : null}
            </SimpleGrid>
          )}
        </Grid.Col>
      </Grid>
    </div>
  );
}
