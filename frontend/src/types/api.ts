export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface CriminalRecord {
  id?: number;
  name: string;
  case_info: string;
  image_front: string;
  image_left: string;
  image_right: string;
  image?: string;
  face_encoding?: string | null;
  created_at?: string;
}

export interface MatchResult {
  message: string;
  criminal?: {
    name: string;
    case_info?: string;
    image?: string;
  };
}
