export type Token = 
    | { type: 'number'; value: number }
    | { type: 'separator'; value: '-' }
    | { type: 'text'; value: string };

export function tokenize(input: string): Token[] {
    return input
        .split(/\s+/)
        .filter(Boolean)
        .map((token) => {
            if (token === '-') {
                return { type: 'separator', value: '-' };
            } else if (!isNaN(Number(token))) {
                return { type: 'number', value: Number(token) };
            } else {
                return { type: 'text', value: token };
            }
        });
}
