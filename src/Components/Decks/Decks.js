import { useEffect, useState } from "react";
import Header from "../Header/Header";
import CreateBar from "./CreateBar";
import DecksListSettings from "./DecksListSettings";
import NoDeck from "./NoDeck";
const fs = window.require("fs");

const Decks = () => {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    console.log(decks);
  }, [decks]);

  useEffect(() => {
    const data = fs.readFileSync("src/data/decks.json", "utf8");
    setDecks(JSON.parse(data));
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center space-y-8">
        <CreateBar decks={decks} setDecks={setDecks} />
        {decks.length ? (
          <DecksListSettings decks={decks} setDecks={setDecks} />
        ) : (
          <NoDeck />
        )}
      </div>
    </div>
  );
};

export default Decks;
