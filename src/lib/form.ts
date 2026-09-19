export function str(fd: FormData, key: string): string | undefined {
  const value = fd.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function reqStr(fd: FormData, key: string): string {
  const value = str(fd, key);
  if (!value) throw new ActionError(`O campo "${key}" é obrigatório.`);
  return value;
}

export function num(fd: FormData, key: string): number | undefined {
  const value = str(fd, key);
  if (value === undefined) return undefined;
  const parsed = Number(value.replace(",", "."));
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
}

export function reqNum(fd: FormData, key: string): number {
  const value = num(fd, key);
  if (value === undefined) throw new ActionError(`O campo "${key}" precisa ser um número válido.`);
  return value;
}

export function int(fd: FormData, key: string): number | undefined {
  const value = num(fd, key);
  return value === undefined ? undefined : Math.trunc(value);
}

export class ActionError extends Error {}

export function errorMessage(error: unknown): string {
  if (error instanceof ActionError) return error.message;
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: string }).code === "P2003"
  ) {
    return "Não é possível concluir: existem registros vinculados a este item.";
  }
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  ) {
    return "Já existe um registro com esse valor único (verifique placa/código).";
  }
  if (error instanceof Error) return error.message;
  return "Ocorreu um erro inesperado.";
}
