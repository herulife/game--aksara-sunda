"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult = {
  ok: boolean;
  error?: string;
};

type QuizPayload = {
  levelNumber: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
};

type TracingPayload = {
  levelNumber: number;
  targetText: string;
  attemptCount: number;
  durationSeconds: number;
  completed: boolean;
};

type ReadingPayload = {
  levelNumber: number;
  promptText: string;
  expectedText: string;
  answerText: string;
  isCorrect: boolean;
};

type SettingsPayload = {
  soundEnabled: boolean;
  musicEnabled: boolean;
};

type ProfileSnapshot = {
  current_level: number;
  highest_score: number;
  total_score: number;
};

type LevelRow = {
  id: string;
  level_number: number;
  passing_score: number;
};

async function getAuthedContext(mode: "quiz" | "tracing" | "reading", levelNumber: number) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Kamu harus login dulu." as const };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("current_level, highest_score, total_score")
    .eq("id", user.id)
    .maybeSingle<ProfileSnapshot>();

  if (profileError || !profile) {
    return { error: "Profil pemain tidak ditemukan." as const };
  }

  const { data: level, error: levelError } = await supabase
    .from("levels")
    .select("id, level_number, passing_score")
    .eq("mode", mode)
    .eq("level_number", levelNumber)
    .maybeSingle<LevelRow>();

  if (levelError || !level) {
    return {
      error:
        `Level ${mode} belum ada di database. Jalankan seed level Supabase dulu supaya progres bisa disimpan.`,
    };
  }

  return { supabase, userId: user.id, profile, level };
}

async function upsertPlayerProgress(params: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  userId: string;
  levelId: string;
  mode: "quiz" | "tracing" | "reading";
  bestScore: number;
  starsEarned: number;
  isCompleted: boolean;
}) {
  const { supabase, userId, levelId, mode, bestScore, starsEarned, isCompleted } = params;
  const { data: existing } = await supabase
    .from("player_progress")
    .select("best_score, stars_earned")
    .eq("player_id", userId)
    .eq("mode", mode)
    .eq("level_id", levelId)
    .maybeSingle<{ best_score: number; stars_earned: number }>();

  const nextBestScore = Math.max(existing?.best_score ?? 0, bestScore);
  const nextStars = Math.max(existing?.stars_earned ?? 0, starsEarned);

  await supabase.from("player_progress").upsert(
    {
      player_id: userId,
      mode,
      level_id: levelId,
      is_unlocked: true,
      is_completed: isCompleted,
      best_score: nextBestScore,
      stars_earned: nextStars,
      last_played_at: new Date().toISOString(),
      completed_at: isCompleted ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "player_id,mode,level_id" },
  );
}

async function unlockNextLevel(params: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  userId: string;
  mode: "quiz" | "tracing" | "reading";
  currentLevelNumber: number;
}) {
  const { supabase, userId, mode, currentLevelNumber } = params;
  const { data: nextLevel } = await supabase
    .from("levels")
    .select("id")
    .eq("mode", mode)
    .eq("level_number", currentLevelNumber + 1)
    .maybeSingle<{ id: string }>();

  if (!nextLevel) return;

  await supabase.from("player_progress").upsert(
    {
      player_id: userId,
      mode,
      level_id: nextLevel.id,
      is_unlocked: true,
      is_completed: false,
      best_score: 0,
      stars_earned: 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "player_id,mode,level_id" },
  );
}

async function updateProfileTotals(params: {
  userId: string;
  profile: ProfileSnapshot;
  totalScoreToAdd: number;
  highestScoreCandidate?: number;
  currentLevelCandidate?: number;
}) {
  const { userId, profile, totalScoreToAdd, highestScoreCandidate = 0, currentLevelCandidate } = params;
  const supabase = await createSupabaseServerClient();

  await supabase
    .from("profiles")
    .update({
      total_score: (profile.total_score ?? 0) + totalScoreToAdd,
      highest_score: Math.max(profile.highest_score ?? 0, highestScoreCandidate),
      current_level: Math.max(profile.current_level ?? 1, currentLevelCandidate ?? profile.current_level ?? 1),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

export async function saveQuizResultAction(payload: QuizPayload): Promise<ActionResult> {
  const context = await getAuthedContext("quiz", payload.levelNumber);
  if ("error" in context) {
    return { ok: false, error: context.error };
  }

  const { supabase, userId, profile, level } = context;
  const passed = payload.score >= level.passing_score;
  const starsEarned = payload.score >= 80 ? 3 : payload.score >= level.passing_score ? 2 : payload.score > 0 ? 1 : 0;

  const { error: sessionError } = await supabase.from("quiz_sessions").insert({
    player_id: userId,
    level_id: level.id,
    score: payload.score,
    correct_count: payload.correctCount,
    wrong_count: payload.wrongCount,
    total_questions: payload.totalQuestions,
    status: "completed",
    finished_at: new Date().toISOString(),
  });

  if (sessionError) {
    return { ok: false, error: "Gagal menyimpan hasil kuis." };
  }

  await upsertPlayerProgress({
    supabase,
    userId,
    levelId: level.id,
    mode: "quiz",
    bestScore: payload.score,
    starsEarned,
    isCompleted: passed,
  });

  if (passed) {
    await unlockNextLevel({
      supabase,
      userId,
      mode: "quiz",
      currentLevelNumber: level.level_number,
    });
  }

  await updateProfileTotals({
    userId,
    profile,
    totalScoreToAdd: payload.score,
    highestScoreCandidate: payload.score,
    currentLevelCandidate: passed ? level.level_number + 1 : level.level_number,
  });

  return { ok: true };
}

export async function saveTracingResultAction(payload: TracingPayload): Promise<ActionResult> {
  const context = await getAuthedContext("tracing", payload.levelNumber);
  if ("error" in context) {
    return { ok: false, error: context.error };
  }

  const { supabase, userId, profile, level } = context;
  const awardedScore = payload.completed ? 10 : 0;

  const { error } = await supabase.from("tracing_sessions").insert({
    player_id: userId,
    level_id: level.id,
    target_text: payload.targetText,
    attempt_count: payload.attemptCount,
    duration_seconds: payload.durationSeconds,
    completed: payload.completed,
  });

  if (error) {
    return { ok: false, error: "Gagal menyimpan latihan menulis." };
  }

  await upsertPlayerProgress({
    supabase,
    userId,
    levelId: level.id,
    mode: "tracing",
    bestScore: awardedScore,
    starsEarned: payload.completed ? 2 : 0,
    isCompleted: payload.completed,
  });

  await updateProfileTotals({
    userId,
    profile,
    totalScoreToAdd: awardedScore,
  });

  return { ok: true };
}

export async function saveReadingResultAction(payload: ReadingPayload): Promise<ActionResult> {
  const context = await getAuthedContext("reading", payload.levelNumber);
  if ("error" in context) {
    return { ok: false, error: context.error };
  }

  const { supabase, userId, profile, level } = context;
  const awardedScore = payload.isCorrect ? 10 : 0;

  const { error } = await supabase.from("reading_sessions").insert({
    player_id: userId,
    level_id: level.id,
    prompt_text: payload.promptText,
    expected_text: payload.expectedText,
    answer_text: payload.answerText,
    is_correct: payload.isCorrect,
  });

  if (error) {
    return { ok: false, error: "Gagal menyimpan latihan membaca." };
  }

  await upsertPlayerProgress({
    supabase,
    userId,
    levelId: level.id,
    mode: "reading",
    bestScore: awardedScore,
    starsEarned: payload.isCorrect ? 2 : 0,
    isCompleted: payload.isCorrect,
  });

  await updateProfileTotals({
    userId,
    profile,
    totalScoreToAdd: awardedScore,
  });

  return { ok: true };
}

export async function updateSettingsAction(payload: SettingsPayload): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Kamu harus login dulu." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      sound_enabled: payload.soundEnabled,
      music_enabled: payload.musicEnabled,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: "Gagal menyimpan pengaturan." };
  }

  return { ok: true };
}
