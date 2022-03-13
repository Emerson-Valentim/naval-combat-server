import { NavalCombatSocket as NavalCombatSocketPort } from "../../ports/notification";

const example = async (NavalCombatSocket: typeof NavalCombatSocketPort, input: any) => {
  await NavalCombatSocket.emit({
    channel: "server:example",
    message: input
  });

  return;
};

export default example;