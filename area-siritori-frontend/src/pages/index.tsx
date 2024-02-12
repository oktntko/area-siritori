export default function Home() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <h1>Home</h1>
      <button
        type="button"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        {count}
      </button>
      <code>code 01234</code>
    </>
  );
}
