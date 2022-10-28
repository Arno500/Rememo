import { Link } from "react-router-dom";
import DeckPreview from "./DeckPreview/DeckPreview";

const DecksList = ({ decks }) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      {decks.map((deck) => (
        <DeckPreview deck={deck} />
      ))}
    </div>
  );
};

export default DecksList;
