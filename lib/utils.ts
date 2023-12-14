/**
 * Execute Deno Command and dump output
 *
 * const command = new Deno.Command('aws', {
      args: [ 'configure', 'set', key, value, '--profile', PROFILE],
    });
    await executeCommand(command);
 */
export const executeCommand = async (cmd: Deno.Command) => {
  const { code, stdout, stderr } = await cmd.output();

  if (code !== 0) {
    console.log(`Non-zero exit code: ${code}`);
  }
  if (stdout.length > 0) {
    console.log(new TextDecoder().decode(stdout));
  }
  if (stderr.length > 0) {
    console.log(new TextDecoder().decode(stderr));
  }
};
export const j = 'asdsdfg';
