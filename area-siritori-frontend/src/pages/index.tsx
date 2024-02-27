import { Icon } from '@iconify/react';
import { range } from 'remeda';
import { Link } from '~/router';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-16 bg-gray-100">
      <div className="-mt-2 mb-2">
        <h1 className="text-8xl">
          <span className="font-bold text-blue-800">盤</span>上しりと
          <span className="font-bold text-red-800">り</span>
        </h1>
      </div>

      {/* Card Desing https://www.youtube.com/watch?app=desktop&v=B2PVKb5L0wo */}
      <div className="flex flex-wrap items-center justify-center gap-8 bg-gray-100">
        {/* Card */}
        {range(1, 5).map((i) => {
          return (
            <Link
              to={`/room/:room_id`}
              params={{ room_id: `${i}` }}
              key={i}
              className="group relative w-60 transform cursor-pointer rounded-xl bg-white p-2 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image */}
              <img
                className="h-40 rounded-xl object-cover"
                src="https://picsum.photos/320/160"
                alt=""
              ></img>
              <div className="p-2">
                {/* Heading */}
                <h2 className="mb-2 text-lg font-bold ">Room No.{i}</h2>
                {/* Description */}
                <p className="text-sm text-gray-600">
                  {range(
                    0,
                    Math.floor(Math.random() * (4 /*=max*/ - 1 /*=min*/ + 1) + /*=min*/ 1),
                  ).map(() => (
                    <>{avator()}</>
                  ))}
                </p>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 h-full w-full rounded-xl bg-black/30 opacity-0 transition-all group-hover:opacity-100"></div>
              <div className="absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-1/2 text-center text-white opacity-0 transition-all group-hover:top-[calc(50%-32px)] group-hover:opacity-100">
                <h3 className="text-2xl font-bold tracking-widest">JOIN!</h3>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <Link
          to={`/play`}
          type="button"
          className="flex flex-row items-center justify-center rounded-full bg-green-500 px-8 py-2 text-xl font-bold text-white shadow-lg transition-all hover:bg-green-700"
        >
          <Icon icon="icon-park:family" className="-ml-2 mr-2 inline "></Icon>
          <span className="">Play with Friend</span>
        </Link>

        <button
          type="button"
          className="flex flex-row items-center justify-center rounded-full bg-blue-500 px-8 py-2 text-xl font-bold text-white shadow-lg transition-all hover:bg-blue-700"
        >
          <Icon icon="openmoji:japanese-symbol-for-beginner" className="-ml-2 mr-2 inline "></Icon>
          <span className="">Tutorial</span>
        </button>
      </div>
    </div>
  );
}

function avator() {
  const emojis = [
    '😄',
    '😃',
    '😀',
    '😊',
    '😉',
    '😍',
    '😘',
    '😚',
    '😗',
    '😙',
    '😜',
    '😝',
    '😛',
    '😳',
    '😁',
    '😔',
    '😌',
    '😒',
    '😞',
    '😣',
    '😢',
    '😂',
    '😭',
    '😪',
    '😥',
    '😰',
    '😅',
    '😓',
    '😩',
    '😫',
    '😨',
    '😱',
    '😠',
    '😡',
    '😤',
    '😖',
    '😆',
    '😋',
    '😷',
    '😎',
    '😴',
    '😵',
    '😲',
    '😟',
    '😦',
    '😧',
    '😈',
    '👿',
    '😮',
    '😬',
    '😐',
    '😕',
    '😯',
    '😶',
    '😇',
    '😏',
    '😑',
  ];

  return emojis[Math.floor(Math.random() * emojis.length)];
}
