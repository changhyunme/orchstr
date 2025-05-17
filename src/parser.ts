import type { Token } from './tokenizer.ts';

type InstrumentGroup = 'woodwinds' | 'brass' | 'strings' | 'extras';

const groupOrder: InstrumentGroup[] = ['woodwinds', 'brass', 'strings', 'extras'];

export function parse(tokens: Token[]) {
    const result: Record<InstrumentGroup, any> = {
        woodwinds: [],
        brass: [],
        strings: [],
        extras: [],
    };

    let currentGroupIndex = 0;
    let currentGroup = groupOrder[currentGroupIndex];

    for (const token of tokens) {
        if (token.type === 'separator') {
            currentGroupIndex++;
            currentGroup = groupOrder[currentGroupIndex] || 'extras';
            continue;
        }

        switch (token.type) {
            case 'number':
                result[currentGroup].push({ count: token.value });
                break;
            case 'text':
                if (token.value === 'str') {
                    result.strings = true;
                } else {
                    result.extras.push(token.value);
                }
                break;
        }
    }

    return result;
}
