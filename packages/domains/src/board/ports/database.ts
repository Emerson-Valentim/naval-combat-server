import { Database } from "@naval-combat-server/ports";

export enum TileStatus {
  EMPTY = "EMPTY",
  FILLED = "FILLED",
  MISSED = "MISSED",
  DESTROYED = "DESTROYED",
}

export enum BoardStatus {
  PENDING = "PENDING",
  DONE = "DONE",
  FINISHED = "FINISHED",
}

interface Position {
  [key: number]: TileStatus;
}

export interface State {
  [userId: string]: {
    positions: Position[];
    status: BoardStatus;
  };
}

export interface Board {
  id: string;
  roomId: string;
  size: number;
  currentPlayer: string;
  state: State;
  status: BoardStatus;
  createdAt: number;
  updatedAt: number;
}

const BoardSchema = {
  roomId: String,
  size: Number,
  currentPlayer: String,
  status: String,
  state: {
    _id: false,
    required: false,
    type: Map,
  },
  createdAt: Number,
  updatedAt: Number,
};

const Board = new Database(process.env.MONGODB_ADDRESS!);

const getEntity = async () => {
  const BoardEntity = await Board.getEntity("Board", BoardSchema);

  return BoardEntity;
};

const buildState = ({ size }: { size: number }) => {
  const obj = {
    status: BoardStatus.PENDING,
    positions: [] as any,
  };

  for (let i = 0; i < size; i++) {
    const row: Position = {};

    for (let j = 0; j < size; j++) {
      row[j] = TileStatus.EMPTY;
    }

    obj.positions.push(row);
  }

  return obj;
};

const create = async (
  input: Pick<Board, "roomId" | "size" | "currentPlayer">
): Promise<Board> => {
  const entity = await getEntity();

  const createdBoard: Board = await entity.create({
    ...input,
    state: {
      [input.currentPlayer]: buildState({ size: input.size }),
    },
    status: BoardStatus.PENDING,
  });

  return createdBoard;
};

const update = async ({
  id,
  ...input
}: Partial<Pick<Board, "currentPlayer" | "state" | "status">> & {
  id: string;
}): Promise<Board> => {
  const entity = await getEntity();

  await entity.findByIdAndUpdate(id, input);

  const board = await entity.findById(id);

  return board;
};

const findBy = async (filter: { [key: string]: any }): Promise<Board> => {
  const entity = await getEntity();

  const board = await entity.findOne(filter);

  return board.toJSON();
};

const findById = async (id: string): Promise<Board | null> => {
  const entity = await getEntity();

  return entity.findById(id);
};

export default {
  findBy,
  create,
  update,
  findById,
  buildState,
};
