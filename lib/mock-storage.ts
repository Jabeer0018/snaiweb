export type ExamMode = "exam" | "practice";

export interface InProgressAttempt {
  examId: string;
  mode: ExamMode;
  startedAt: number;
  timerMinutes: number | null;
  answers: Record<number, string>;
  markedForReview: number[];
  visited: number[];
  currentNumber: number;
}

export interface CompletedAttempt {
  attemptId: string;
  examId: string;
  completedAt: number;
  mode: ExamMode;
  score: number;
  maxPoints: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  timeTakenSeconds: number;
  answers: Record<number, string>;
  markedForReview: number[];
}

export interface MockStorageState {
  inProgress: Record<string, InProgressAttempt>;
  completed: Record<string, CompletedAttempt[]>;
}

const STORAGE_KEY = "snai_mock_exams_v1";

export function loadMockStorage(): MockStorageState {
  if (typeof window === "undefined") {
    return { inProgress: {}, completed: {} };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { inProgress: {}, completed: {} };
    const parsed = JSON.parse(raw) as MockStorageState;
    return {
      inProgress: parsed.inProgress || {},
      completed: parsed.completed || {},
    };
  } catch {
    return { inProgress: {}, completed: {} };
  }
}

export function saveMockStorage(state: MockStorageState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota errors
  }
}

export function saveInProgressAttempt(attempt: InProgressAttempt) {
  const state = loadMockStorage();
  state.inProgress[attempt.examId] = attempt;
  saveMockStorage(state);
}

export function clearInProgressAttempt(examId: string) {
  const state = loadMockStorage();
  delete state.inProgress[examId];
  saveMockStorage(state);
}

export function recordCompletedAttempt(attempt: CompletedAttempt) {
  const state = loadMockStorage();
  const list = state.completed[attempt.examId] || [];
  state.completed[attempt.examId] = [attempt, ...list].slice(0, 20);
  delete state.inProgress[attempt.examId];
  saveMockStorage(state);
}
