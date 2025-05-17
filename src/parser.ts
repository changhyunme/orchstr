import type { Token } from './tokenizer.ts';

type InstrumentGroup = 'woodwinds' | 'brass' | 'strings' | 'extras';

const groupOrder: InstrumentGroup[] = ['woodwinds', 'brass', 'strings', 'extras'];

const instrumentOrder: Record<InstrumentGroup, string[]> = {
    woodwinds: ['flute', 'oboe', 'clarinet', 'bassoon', 'saxophone'],
    brass: ['trumpet', 'horn', 'trombone', 'tuba'],
    strings: ['violin', 'viola', 'violoncello', 'bass'],
    extras: [],
};

// 세부 악기 코드 매핑 예시 (필요에 따라 추가/변경)
const detailInstrumentMap: Record<string, string> = {
    '1': 'flute',
    'pic': 'piccolo',
    '2': 'oboe',
    'eb3': 'eb clarinet',
    'bcl': 'bass clarinet',
    '3': 'bassoon',
    'cbn': 'contra bassoon',
    '12': 'clarinet',
    // 여기 더 추가 가능
};

export function parse(tokens: Token[]) {
    const result: {
        solo: string | null;
        woodwinds: Array<{ instrument?: string; count?: number; details?: string[] }>;
        brass: Array<{ instrument?: string; count?: number; details?: string[] }>;
        strings: Array<{ instrument?: string; count?: number; details?: string[] }>;
        extras: string[];
        perc: string[];
    } = {
        solo: null,
        woodwinds: [],
        brass: [],
        strings: [],
        extras: [],
        perc: [],
    };

    let currentGroupIndex = 0;
    let currentGroup = groupOrder[currentGroupIndex];
    let i = 0;
    let inPercussion = false;

    // solo 체크
    if (tokens[i]?.type === 'text' && tokens[i].value === 'solo') {
        i++;
        if (tokens[i]?.type === 'text') {
            result.solo = tokens[i].value;
            i++;
        }
    }

    while (i < tokens.length) {
        const token = tokens[i];

        if (inPercussion) {
            if (token.type === 'text') {
                result.perc.push(token.value);
                i++;
                continue;
            }
            if (token.type === 'separator') {
                inPercussion = false;
                currentGroupIndex++;
                currentGroup = groupOrder[currentGroupIndex] || 'extras';
                i++;
                continue;
            }
            i++;
            continue;
        }

        if (token.type === 'text' && token.value === 'perc:') {
            inPercussion = true;
            i++;
            continue;
        }

        if (token.type === 'separator') {
            currentGroupIndex++;
            currentGroup = groupOrder[currentGroupIndex] || 'extras';
            i++;
            continue;
        }

        if (token.type === 'number') {
            let details: string[] = [];
            const nextToken = tokens[i + 1];
            if (nextToken && nextToken.type === 'text' && /^\[.*\]$/.test(nextToken.value)) {
                const inside = nextToken.value.slice(1, -1);
                const parts = inside.split('/');
                details = parts.map(code => detailInstrumentMap[code] || code);
                i += 2;
            } else {
                details = [];
                i++;
            }

            let baseInstrument = result[currentGroup].length > 0
                ? result[currentGroup][result[currentGroup].length - 1].instrument
                : null;

            if (!baseInstrument) {
                result[currentGroup].push({ count: token.value, details });
            } else {
                result[currentGroup].push({ instrument: baseInstrument, count: token.value, details });
            }

            continue;
        }

        if (token.type === 'text') {
            let foundGroup: InstrumentGroup | null = null;
            for (const g of groupOrder) {
                if (instrumentOrder[g].includes(token.value)) {
                    foundGroup = g;
                    break;
                }
            }
            if (foundGroup) {
                currentGroup = foundGroup;
                result[currentGroup].push({ instrument: token.value, count: 1 });
            } else {
                result.extras.push(token.value);
            }
            i++;
            continue;
        }
    }

    return result;
}
