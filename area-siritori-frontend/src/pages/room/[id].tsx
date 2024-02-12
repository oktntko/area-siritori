import { useParams } from "~/router";

export default function Home() {
  const { id } = useParams("/room/:id");
  return <h1>Room ID:{id}</h1>;
}
