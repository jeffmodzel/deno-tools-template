//
// Example script to use as a starter.
//
import { parseFlags, ParseFlagsOptions } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/flags/mod.ts';
import {
  blue,
  boldBlue,
  boldCyan,
  boldGray,
  boldGreen,
  boldMagenta,
  boldRed,
  boldWhite,
  boldYellow,
  cyan,
  debug,
  error,
  fail,
  failure,
  gray,
  green,
  info,
  magenta,
  red,
  success,
  warn,
  warning,
  white,
  yellow,
} from './lib/console.ts';
import { sleep } from 'https://deno.land/x/sleep@v1.2.1/mod.ts';

//
// deno run -A example.ts --profile enterprise-dev --region us-east-1
//

const parseOptions: ParseFlagsOptions = {
  flags: [{
    name: 'profile',
    type: 'string',
    required: true,
  }, {
    name: 'region',
    type: 'string',
    required: true,
  }],
};

//
// main
//
if (import.meta.main) {
  console.log(import.meta.url);
  const { flags } = parseFlags(Deno.args, parseOptions);
  console.log(flags);

  info('some info message lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ');
  success('some success message lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ');
  error('some error message lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ');
  fail('some fail message lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ');
  failure('some failure message lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ');
  warn('some warn message lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ');
  warning('some warning message lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ');
  debug('some debug message lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ');

  console.log(blue('blue text'));
  console.log(boldBlue('bold blue text'));
  console.log(green('green text'));
  console.log(boldGreen('bold green text'));
  console.log(red('red text'));
  console.log(boldRed('bold red text'));
  console.log(yellow('yellow text'));
  console.log(boldYellow('bold yellow text'));

  console.log(white('white text'));
  console.log(boldWhite('bold white text'));

  console.log(gray('gray text'));
  console.log(boldGray('bold gray text'));

  console.log(cyan('cyan text'));
  console.log(boldCyan('bold cyan text'));

  console.log(magenta('magenta text'));
  console.log(boldMagenta('bold magenta text'));

  await sleep(1);
}
