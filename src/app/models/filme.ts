export interface Filme {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface RespostaApi {
  page: number;
  results: Filme[];
  total_pages: number;
}
