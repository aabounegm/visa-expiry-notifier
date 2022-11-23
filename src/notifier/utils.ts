export const TELEGRAM_MAX_MESSAGE_LENGTH = 4096;

export function* chunkMessages(msgs: string[]) {
  let group: string[] = [];
  let groupLength = 0;
  for (const msg of msgs) {
    const newLinesCount = group.length - 1;
    if (groupLength + msg.length + newLinesCount > TELEGRAM_MAX_MESSAGE_LENGTH) {
      yield group.join("\n");
      group = [];
      groupLength = 0;
    }
    group.push(msg);
    groupLength += msg.length;
  }
  if (group.length > 0) {
    yield group.join("\n");
  }
}
