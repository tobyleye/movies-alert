"use client";
import { getRecentMovies } from "@/src/api";
import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  Image,
  Text,
  Grid,
  SimpleGrid,
  Button,
} from "@mantine/core";

const MovieCard = ({ movie }: { movie: any }) => {
  const generateDownloadLink = () => {};
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

        <Text mt="xs" color="dimmed" size="sm">
          {movie.synopsis}
        </Text>

        <div>
          <Button onClick={generateDownloadLink}>generate download link</Button>
        </div>
      </Card>
    </div>
  );
};
export default function RecentMovies() {
  const [movies, setMovies] = useState([]);
  const [errorLoadingMovies, setErrorLoadingMovies] = useState(false);

  useEffect(() => {
    getRecentMovies()
      .then(({ data }) => {
        setMovies(data);
      })
      .catch(() => {
        setErrorLoadingMovies(true);
      });
  }, []);
  return (
    <div>
      <Grid justify="center">
        <Grid.Col sm={6}>
          <h1 className="text-center mb-0">Recent movies</h1>
          <Text align="center" className="mb-8">
            Source: tfpdl.
            <Text size="sm" component="span">
              (whatever domain they are using now)
            </Text>
          </Text>

          {errorLoadingMovies ? (
            <Alert>Ahh sorry, ann error occured loading movies</Alert>
          ) : null}

          <SimpleGrid spacing="xl">
            {movies && movies.length > 0
              ? movies.map((movie: any) => {
                  return <MovieCard key={movie.link} movie={movie} />;
                })
              : null}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </div>
  );
}
