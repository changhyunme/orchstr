import { tokenize } from './tokenizer.ts';
import { parse } from './parser.ts';

export default function orchstr(input: string) {
    const tokens = tokenize(input);
    console.log('Tokens:', tokens);
    const result = parse(tokens);
    return result;
}