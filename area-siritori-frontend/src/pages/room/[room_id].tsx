import { Icon } from '@iconify/react';
import { range } from 'remeda';
import '~/assets/style.css';
import { socket } from '~/lib/socket.io';
import { useParams } from '~/router';

type Position = {
  rawIndex: number;
  colIndex: number;
};

type Direction = {
  Down: number;
  Right: number;
};
// prettier-ignore
const DirectionObject = {
  LeftUp  : { Down: -1, Right: -1 },   Up: { Down: -1, Right:  0 }, RightUp  : { Down: -1, Right:  1 },
  Left    : { Down:  0, Right: -1 },                                Right    : { Down:  0, Right:  1 },
  LeftDown: { Down:  1, Right: -1 }, Down: { Down:  1, Right:  0 }, RightDown: { Down:  1, Right:  1 },
} as const;
function isDirectionString(str: string): str is keyof typeof DirectionObject {
  return Object.keys(DirectionObject).some((key) => key === str);
}

// 棋譜
type History = {
  log: string; //
  word: string; // └単語
  startPosition: Position; // └開始セル位置
  direction: Direction; // └方向
  // putNewCharIndex: []; // TODO └新しくプルインした文字
};

export default function Home() {
  const { room_id } = useParams('/room/:room_id');

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('connect');
    });

    socket.on('event', (args: { id: string; username: string }) => {
      console.log('event', args);
    });

    return () => {
      socket.disconnect();
    };
  }, [room_id]);

  const playerNames = ['Ａ太', 'Ｂ子', 'Ｃ郎']; // 参加者名一覧
  const [turn, setTurn] = useState(0); // 手番

  const [size] = useState({ raw: 6, col: 6 });
  const [board, setBoard] = useState(
    Array<string[]>(size.raw).fill(Array<string>(size.col).fill('')),
  );
  const [position, setPosition] = useState<Position>({ rawIndex: -1, colIndex: -1 });

  // const validWords = []; // 許容する単語一覧
  const notfirstChars = 'ぁぃぅぇぉゃゅょーん'; // １文字目にできない文字
  const [error, setError] = useState({ message: '' });

  const [historyList, setHistoryList] = useState<History[]>([]);

  const startWord = 'しりとり';

  useEffect(() => {
    // createBoard
    putChar({ char: startWord.charAt(0), rawIndex: 2, colIndex: 2 });
    putChar({ char: startWord.charAt(1), rawIndex: 2, colIndex: 3 });
    putChar({ char: startWord.charAt(2), rawIndex: 3, colIndex: 2 });
    putChar({ char: startWord.charAt(3), rawIndex: 3, colIndex: 3 });
  }, []);

  function putChar(param: { char: string; rawIndex: number; colIndex: number }) {
    setBoard((pre) =>
      pre.map((raw, rawIndex) =>
        raw.map((cell, colIndex) =>
          param.rawIndex === rawIndex && param.colIndex === colIndex ? param.char : cell,
        ),
      ),
    );
  }

  // 配置可能なセルがあるかチェックする
  useEffect(() => {
    // 現在の位置から８方向に空白のセルがある場合: true
    // 現在の位置から８方向に空白のセルがない場合: false
    const canPutWord = Object.values(DirectionObject).some((direction) => {
      return range(0, Math.max(size.raw, size.col)).some((i) => {
        const cell =
          board[between(0, position.rawIndex + direction.Down * i, size.raw - 1)][
            between(0, position.colIndex + direction.Right * i, size.col - 1)
          ];

        return cell === '';
      });
    });
    if (!canPutWord) {
      window.alert('ゲームセット！');
    }
  }, [size, board, position]);

  const [displaySelectStartCell, setDisplaySelectStartCell] = useState(true);

  return (
    <div className="container mx-auto flex flex-col gap-4">
      <h1>Room ID:{room_id}</h1>

      <div className="flex flex-col items-center gap-2">
        <table id="board" border={0} cellSpacing={0} cellPadding={0}>
          <tbody>
            {board.map((raw, rawIndex) => {
              return (
                <tr key={`${rawIndex}`}>
                  {raw.map((cell, colIndex) => {
                    return (
                      <td
                        key={`${rawIndex}-${colIndex}`}
                        className={
                          position.rawIndex === rawIndex && position.colIndex === colIndex
                            ? 'focusCell'
                            : ''
                        }
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {displaySelectStartCell ? (
        // 最初のセル選択エリア
        <SelectStartCell></SelectStartCell>
      ) : (
        // 単語入力エリア
        <InputWordsArea></InputWordsArea>
      )}
    </div>
  );

  // 最初のセル選択エリア
  function SelectStartCell() {
    return (
      <div className="flex flex-col items-center gap-2">
        <p>{playerNames[turn]}さんの手番です。最初のマスを選んでください。</p>

        <div className="flex gap-2">
          {[
            { value: 'し', rawIndex: 2, colIndex: 2 },
            { value: 'り', rawIndex: 2, colIndex: 3 },
            { value: 'と', rawIndex: 3, colIndex: 2 },
            { value: 'り', rawIndex: 3, colIndex: 3 },
          ].map((arg, i) => {
            return (
              <button
                key={i}
                className="inline-flex h-8 w-8 items-center rounded-full bg-red-200 p-2 text-center transition-colors hover:bg-red-300"
                type="button"
                onClick={() => {
                  setPosition(arg);
                  setDisplaySelectStartCell(false);
                }}
              >
                {arg.value}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 単語入力エリア
  function InputWordsArea() {
    // 単語の決定ボタンクリック時
    function clickDecision(word: string, direction: Direction) {
      // 単語チェック
      const hasError = checkWord(word, direction);
      console.log(hasError);
      if (hasError?.message) {
        setError(hasError);
        return;
      } else {
        setError({ message: '' });
      }

      // 単語配置
      putWord(word, direction);

      // フォーカス移動
      changeFocusPosition(word, direction); // フォーカス移動

      // 手番移動
      setTurn((turn + 1) % playerNames.length);
    }

    return (
      <form
        className="flex flex-col items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();

          // 入力チェック
          const form = new FormData(e.currentTarget);
          const directionString = form.get('direction');
          const word = form.get('word');

          // direction
          if (typeof directionString !== 'string' || !isDirectionString(directionString)) {
            setError({ message: '方向を指定してください。' });
            return;
          }

          // word
          if (typeof word !== 'string' || word === '') {
            setError({ message: '単語を入力してください。' });
            return;
          }
          if (!/^[ぁ-んー]+$/.test(word)) {
            setError({ message: 'ひらがなで入力してください。' });
            return;
          }

          const direction = DirectionObject[directionString];
          // 単語の決定ボタンクリック時
          clickDecision(word, direction);
        }}
      >
        <p>{playerNames[turn]}さんの手番です。進む方向を選び、文字を入力してください。</p>

        <div className="mx-auto grid w-24 grid-cols-3">
          {[
            { key: 'LeftUp', /*    */ icon: 'mi:arrow-left-up' },
            { key: 'Up', /*        */ icon: 'mi:arrow-up' },
            { key: 'RightUp', /*   */ icon: 'mi:arrow-right-up' },
            { key: 'Left', /*      */ icon: 'mi:arrow-left' },
            undefined,
            { key: 'Right', /*     */ icon: 'mi:arrow-right' },
            { key: 'LeftDown', /*  */ icon: 'mi:arrow-left-down' },
            { key: 'Down', /*      */ icon: 'mi:arrow-down' },
            { key: 'RightDown', /* */ icon: 'mi:arrow-right-down' },
          ].map((obj, i) => {
            return (
              <div key={i} className="relative flex h-8 w-8 items-center justify-center">
                {obj && (
                  <>
                    <input
                      id={obj.key}
                      className="peer pointer-events-none absolute opacity-0"
                      type="radio"
                      name="direction"
                      value={obj.key}
                      required
                    />
                    <label
                      htmlFor={obj.key}
                      className="flex h-full w-full cursor-pointer items-center justify-center transition-colors hover:bg-red-200 peer-checked:bg-red-400"
                    >
                      <Icon icon={obj.icon} className="h-6 w-6" />
                    </label>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="mx-auto flex flex-col items-center gap-1">
          <div className="flex">
            <input
              id="word"
              name="word"
              className="ml-12 block appearance-none rounded border px-3 py-2.5 leading-tight text-gray-700 shadow focus:outline-none"
              defaultValue=""
              type="text"
              placeholder=""
              autoComplete="off"
              pattern="^[ぁ-んー]+$"
              required
              minLength={2}
              maxLength={Math.max(size.raw, size.col)}
            />
            <button
              type="submit"
              className="rounded-e-lg border border-red-700 bg-red-700 px-4 py-2.5 text-sm text-white hover:bg-red-800 "
            >
              決定
            </button>
          </div>

          {error.message && (
            <p className={(error.message ? '' : 'hidden ') + 'text-sm italic text-red-600'}>
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-1 ">
          {historyList.map((history, i) => {
            return (
              <p key={i} className="p-1 odd:bg-red-100 even:bg-blue-100">
                {history.log}
              </p>
            );
          })}
        </div>
      </form>
    );

    // 単語チェック
    function checkWord(word: string, direction: Direction) {
      // 「ん」チェック
      if (word.endsWith('ん')) {
        return { message: '「ん」で終わってはいけません。' };
      }

      // 盤からのはみ出しチェック
      if (
        !isBetween(0, position.rawIndex + direction.Down * (word.length - 1), size.raw) ||
        !isBetween(0, position.colIndex + direction.Right * (word.length - 1), size.col)
      ) {
        return {
          message: '選択した方向へは' + word.length + '文字の単語は作れません。',
        };
      }

      // 空白セルの通過チェック
      if (
        word
          .split('')
          .map(
            (_, i) =>
              board[position.rawIndex + direction.Down * i][
                position.colIndex + direction.Right * i
              ],
          )
          .filter((char) => char === '').length === 0
      ) {
        return { message: '空白マスを通るように単語を作ってください。' };
      }

      // 既存文字チェック
      const notMatchChar = // 既存の文字と合わない文字
        word.split('').filter((inputChar, i) => {
          const boardChar =
            board[position.rawIndex + direction.Down * i][position.colIndex + direction.Right * i];
          return boardChar !== '' && inputChar !== boardChar;
        });

      if (notMatchChar.length > 0) {
        return {
          message: `マスに配置されている文字と合いません。（${notMatchChar.join(',')}）`,
        };
      }

      // 既存単語チェック
      if (historyList.some((history) => history.word === word)) {
        return {
          message: `既に使われている単語です。`,
        };
      }

      // 許容単語チェック
      // for (let i = 0; i < validWords.length; i ++) {
      //   return { "result": false, "errorMessage": "辞書に載っていません。" };
      // }

      // エラー無し
      console.log('エラー無し');
    }

    // 単語配置
    function putWord(word: string, direction: Direction) {
      // 棋譜の記録
      const history: History = {
        log: `${playerNames[turn]}さんは「${word}」をプレイしました。`,
        word,
        direction,
        startPosition: position,
      };
      setHistoryList((pre) => [...pre, history]);

      // 単語の配置
      word.split('').forEach((char, i) => {
        putChar({
          char,
          rawIndex: position.rawIndex + direction.Down * i,
          colIndex: position.colIndex + direction.Right * i,
        });
      });
    }

    // フォーカス移動
    function changeFocusPosition(word: string, direction: Direction) {
      const i =
        word.length -
        word
          .split('')
          .reverse()
          .findIndex((char) => !notfirstChars.includes(char)) -
        1;

      setPosition((pre) => ({
        rawIndex: pre.rawIndex + direction.Down * i,
        colIndex: pre.colIndex + direction.Right * i,
      }));
    }
  }
}

function between(min: number, num: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

function isBetween(min: number, num: number, max: number) {
  return between(min, num, max) === num;
}
