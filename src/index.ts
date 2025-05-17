import { tokenize } from './tokenizer.ts';
import { parse } from './parser.ts';

export default function orchstr(input: string) {
    const tokens = tokenize(input);
    // console.log('Tokens:', tokens);  // 필요하면 활성화
    return parse(tokens);
}
