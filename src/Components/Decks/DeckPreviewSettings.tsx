import { XCircle } from "react-feather";
import { BiExport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Deck } from "../../Interfaces/deck.interface";
import useDecksStore from "../../stores/decks";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import useSettingsStore from "../../stores/settings";
const fs = window.require("fs");

interface DeckPreviewSettingsProps {
  deck: Deck;
}

const DeckPreviewSettings = ({ deck }: DeckPreviewSettingsProps) => {
  const decks = useDecksStore((state: any) => state.decks);
  const setDecks = useDecksStore((state: any) => state.setDecks);
  const setSomethingChanged = useDecksStore(
    (state: any) => state.setSomethingChanged
  );
  const settings = useSettingsStore((state: any) => state.settings);

  const onClickCross = () => {
    const newDecks = [...decks];
    const indexDeck = decks
      .map((deck: { id: number }) => deck.id)
      .indexOf(deck.id);
    newDecks.splice(indexDeck, 1);
    setDecks(newDecks);
    setSomethingChanged(true);
  };

  const handleClickExport = (e: any) => {
    fs.writeFileSync(
      `${settings.pathExport}${deck.id}.d.json`,
      JSON.stringify(deck)
    );
    toast("File successfully exported !", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <div className="grid grid-cols-3 gap-3 items-center">
      <Link to={`/decks/edit/${deck.id}`}>
        <h1 className="text-blue-400 italic font-bold cursor-pointer">
          {deck.name}
        </h1>
      </Link>
      <h1 className="text-sm">
        {deck.cards.length} card{deck.cards.length > 1 ? "s" : ""}
      </h1>
      <div className="flex space-x-2 items-center ">
        <XCircle
          className="text-gray-400 cursor-pointer"
          onClick={onClickCross}
        />
        <BiExport
          onClick={handleClickExport}
          className="text-2xl cursor-pointer text-gray-400"
        />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default DeckPreviewSettings;
