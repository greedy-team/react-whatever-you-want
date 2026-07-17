export interface Movie {
  id: number;
  title: string;
  genre: string;
  era: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  genre_ids: number[];
  release_date: string;
}

export interface TMDBResponse {
  results: TMDBMovie[];
}
