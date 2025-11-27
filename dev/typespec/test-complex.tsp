model User {
  id: string;
  name: string;
  email?: string;
  age: int32;
  score: float64;
  active: boolean;
  tags: string[];
  metadata: bytes;
  createdAt: plainDate;
}