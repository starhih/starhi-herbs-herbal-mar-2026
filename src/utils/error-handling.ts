export function logError(message: string, component?: string, error?: any) {
    const prefix = component ? `[${component}] ` : '';
    console.error(`${prefix}${message}`, error || '');
}

export function handleError(error: unknown, fallbackMessage?: string): string {
    const message = error instanceof Error ? error.message : (fallbackMessage || 'An unexpected error occurred');
    logError(message, undefined, error);
    return message;
}
