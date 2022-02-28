export const isTruthy = <T>(x: T | null | undefined): x is T => Boolean(x);
