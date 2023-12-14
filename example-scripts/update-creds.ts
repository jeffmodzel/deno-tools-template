import { parseFlags, ParseFlagsOptions } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/flags/mod.ts';
import { colors } from 'https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts';
import { executeCommand } from './lib/utils.ts';

const parseOptions: ParseFlagsOptions = {
  flags: [{
    name: 'env',
    type: 'string',
    required: true,
  }],
};

const green = colors.bold.green;

//
// main
// deno run --allow-net --allow-read --allow-run update-creds.ts
//
if (import.meta.main) {
  console.log(import.meta.url);
  const { flags } = parseFlags(Deno.args, parseOptions);
  console.log(flags);

  const FILENAME = 'creds.txt';
  const PROFILE = flags.env === 'prod' ? 'enterprise-prod' : 'enterprise-dev';

  const text = await Deno.readTextFile(FILENAME);
  const lines = text.split('\n');

  for (let line of lines) {
    line = line.trim();
    //console.log(line);

    if (line.length === 0 || line.startsWith('#')) {
      continue;
    }

    const parts = line.split(' = ');
    const key = parts[0].trim();
    const value = parts[1].trim();
    console.log(
      `Setting ${green(key)} to ${value.length > 50 ? value.substring(0, 40) + '*****' : value}`,
    );

    const command = new Deno.Command('aws', {
      args: [
        'configure',
        'set',
        key,
        value,
        '--profile',
        PROFILE,
      ],
    });
    await executeCommand(command);
  }

  console.log(
    `Validating credentials for profile: ${green(PROFILE)} with STS Get-Caller-Identity`,
  );

  const validateCmd = new Deno.Command('aws', {
    args: [
      'sts',
      'get-caller-identity',
      '--profile',
      PROFILE,
    ],
  });

  await executeCommand(validateCmd);
}
