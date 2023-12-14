import { colors } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts';

// explore italic and bright, bg/backgroun
export const blue = colors.blue;
export const boldBlue = colors.bold.blue;

export const green = colors.green;
export const boldGreen = colors.bold.green;

export const red = colors.red;
export const boldRed = colors.bold.red;

export const yellow = colors.yellow;
export const boldYellow = colors.bold.yellow;

export const white = colors.white;
export const boldWhite = colors.bold.white;

export const cyan = colors.cyan;
export const boldCyan = colors.bold.cyan;

export const gray = colors.gray;
export const boldGray = colors.bold.gray;

export const magenta = colors.magenta;
export const boldMagenta = colors.bold.magenta;

export const info = (msg: string) => console.log(blue(`[INFO] ${msg}`));
export const success = (msg: string) => console.log(green(`[SUCCESS] ${msg}`));
export const error = (msg: string) => console.log(red(`[ERROR] ${msg}`));
export const fail = (msg: string) => console.log(red(`[FAIL] ${msg}`));
export const failure = (msg: string) => console.log(red(`[FAILURE] ${msg}`));
export const warn = (msg: string) => console.log(yellow(`[WARN] ${msg}`));
export const warning = (msg: string) => console.log(yellow(`[WARNING] ${msg}`));
export const debug = (msg: string) => console.log(gray(`[DEBUG] ${msg}`));
