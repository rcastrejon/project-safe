const PostgresErrors = {
  "23505": "DUPLICATE_KEY",
} as const;

export type MaybeQueryError = {
  code?: keyof typeof PostgresErrors;
};
