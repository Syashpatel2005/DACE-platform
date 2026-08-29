export type Subject = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export type Topic = {
  id: string;
  name: string;
  slug: string;
  order: number;
  subjectId?: string;
};

export type SubjectWithTopics = Subject & {
  topics: Omit<Topic, "subjectId">[];
};

export type SubjectsResponse =
  | { success: true; subjects: Subject[] }
  | { success: false; error: string };

export type TopicsResponse =
  | { success: true; topics: Topic[] }
  | { success: false; error: string };

export type SyllabusResponse =
  | { success: true; syllabus: SubjectWithTopics[] }
  | { success: false; error: string };