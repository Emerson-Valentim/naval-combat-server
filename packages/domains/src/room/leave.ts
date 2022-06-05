import { curry } from "ramda";

import BoardDomain from "../board";
import UserDomain from "../user";
import { BoardStatus } from "../board/ports/database";

import DatabasePort, { RoomStatus } from "./ports/database";

type Input = {
  roomId: string;
  userId: string;
};

const leave = async (
  Database: typeof DatabasePort,
  Board: typeof BoardDomain,
  User: typeof UserDomain,
  input: Input
) => {
  const room = await Database.findById(input.roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  const isPlayerInRoom = room.players.includes(input.userId);

  if (!isPlayerInRoom) {
    return;
  }

  const currentPlayers = room.players.filter(
    (playerId) => playerId !== input.userId
  );

  const isRoomEmpty = !currentPlayers.length;

  const hasOwnerLeft = !currentPlayers.find(
    (playerId) => playerId === room.owner
  );

  await Database.update({
    id: input.roomId,
    players: currentPlayers,
    status: isRoomEmpty ? RoomStatus.DELETED : room.status,
    owner: hasOwnerLeft ? currentPlayers[0] : room.owner,
  });

  const board = await Board.removePlayer({
    playerId: input.userId,
    roomId: input.roomId,
  });

  const isBoardFinished = board.status === BoardStatus.FINISHED;

  if (!isBoardFinished) {
    return;
  }

  const winner = await User.get(currentPlayers[0], "id");
  await User.computeMeta(winner, "wins");

  const loser = await User.get(input.userId, "id");
  await User.computeMeta(loser, "loses");

  return;
};

export default curry(leave);
