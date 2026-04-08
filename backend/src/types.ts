export interface Event {
  id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  created_at: string;
}

export interface CreateEventBody {
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
}
