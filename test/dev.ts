import orchstr from '../src/index.ts';

const input = "solo flute - 4[123pic] 4[123eh] 4[12ebclbcl] 4[123cbn] - 2 2 2 - tmp - str - hp cel - perc:";
const result = orchstr(input);

console.log(JSON.stringify(result, null, 2));
