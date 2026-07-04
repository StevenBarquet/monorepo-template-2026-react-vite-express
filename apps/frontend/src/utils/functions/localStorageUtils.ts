const AuthToken = 'AuthToken' as const;

/** Guarda un item en local storage */
export function setLocalStorageItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(`Error al guardar en ${key} en local storage:\n`);
  }
}
/** Extrae un valor del local storage */
export function getLocalStorageItem<T>(key: string): T | undefined {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
    return undefined;
  } catch (error) {
    console.log(`Error al extraer ${key} de local storage:\n`);
    return undefined;
  }
}

/** Guarda el token de autenticación */
export function setAuthToken(token?: string) {
  if (!token) return;
  setLocalStorageItem(AuthToken, token);
}

/** Extrae el token de autenticación */
export function getAuthToken() {
  return getLocalStorageItem<string>(AuthToken);
}

/** Elimina el token de autenticación del local storage */
export function clearAuthToken(): void {
  try {
    localStorage.removeItem(AuthToken);
  } catch (error) {
    console.log(`Error al eliminar ${AuthToken} de local storage:\n`);
  }
}

