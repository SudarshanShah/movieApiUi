export type MovieDto = {
  movieId?: number,
  title: string,
  director: string,
  studio: string,
  movieCast: string[],
  releaseYear: number,
  poster?: string,
  posterUrl?: string,
}
