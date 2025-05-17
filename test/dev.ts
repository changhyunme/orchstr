import orchstr from '../src/index.ts';

const input = "solo Flute - 2[1/pic] 0 3[12/eb3/bcl] 3[123/cbn] - 2 2 2 - tmp - str - hp cel - perc: xyl tambn tamtam";
const result = orchstr(input);

console.log(JSON.stringify(result, null, 2));
