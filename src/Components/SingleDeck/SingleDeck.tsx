import clsx from "clsx";
import { useEffect, useState } from "react";
import { Heart } from "react-feather";
import { useParams } from "react-router";
import { Card } from "../../Interfaces/card.interface";
import { Deck } from "../../Interfaces/deck.interface";
import useDecksStore from "../../stores/decks";
import useSettingsStore from "../../stores/settings";
import Header from "../Header/Header";
import DeckDone from "./DeckDone/DeckDone";
import HealthBar from "./HealthBar";
import SingleCard from "./SingleCard/SingleCard";
import WorkSelect from "./WorkSelect/WorkSelect";
const ipcRenderer = window.require("electron").ipcRenderer;

const getWorkCards = (workSelected: string, cards: Array<Card>) => {
  if (workSelected === "wrong") {
    return cards.filter((card) => card.lastResult === "wrong");
  }
  if (workSelected === "fav") {
    return cards.filter((card) => card.fav === true);
  }
  return cards;
};

const SingleDeck = () => {
  const params = useParams();
  const [lives, setLives] = useState({ max: 3, left: 3 });
  const decks = useDecksStore((state: any) => state.decks);
  const deckID = params.id;
  const settings = useSettingsStore((state: any) => state.settings);
  const deckData = decks.find((deck: Deck) => deck.id === deckID);
  const deckCards = [...deckData.cards];
  const [currentResults, setCurrentResults] = useState({
    right: 0,
    wrong: 0,
  });
  const [workSelected, setWorkSelected] = useState({
    cards: "none",
    canStart: false,
    reverse: false,
    typing: false,
  });
  const [shuffledDeck, setShuffledDeck] = useState(
    deckCards.sort((a, b) => 0.5 - Math.random())
  );
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    if (workSelected.canStart === true) {
      ipcRenderer.send("changeDeck", {
        title: "Working",
        deck: deckData.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workSelected]);

  const onClickStartLearn = () => {
    const targetCards = getWorkCards(workSelected.cards, deckCards);
    if (workSelected.reverse) {
      setShuffledDeck(
        targetCards
          .map((card) => ({ ...card, front: card.back, back: card.front }))
          .sort((a, b) => 0.5 - Math.random())
      );
    } else {
      setShuffledDeck(targetCards.sort((a, b) => 0.5 - Math.random()));
    }
    setWorkSelected(
      (oldWork: {
        cards: string;
        canStart: boolean;
        reverse: boolean;
        typing: boolean;
      }) => ({
        ...oldWork,
        canStart: true,
      })
    );
  };

  useEffect(() => {
    if (currentCard === 0) {
      const targetCards = getWorkCards(workSelected.cards, deckCards);
      setShuffledDeck(targetCards.sort((a, b) => 0.5 - Math.random()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCard]);

  return (
    <div
      className={clsx("h-full", {
        "bg-gray-900 text-gray-200": settings.darkMode,
      })}
    >
      <Header title={deckData.name} />
      <div className="p-8">
        <div className="flex flex-col space-y-12 items-center justify-center">
          {workSelected.canStart === false ? (
            <WorkSelect
              cards={deckCards}
              setWorkSelected={setWorkSelected}
              onClickStartLearn={onClickStartLearn}
            />
          ) : currentCard < shuffledDeck.length && shuffledDeck.length ? (
            <div className="flex flex-col items-center">
              {workSelected.typing && <HealthBar lives={lives} />}
              <div className="text-4xl text-center">
                {currentCard + 1} / {shuffledDeck.length}
              </div>
              <SingleCard
                lives={lives}
                setLives={setLives}
                setCurrentResults={setCurrentResults}
                typing={workSelected.typing}
                deckData={deckData}
                cardData={shuffledDeck[currentCard]}
                setCurrentCard={setCurrentCard}
              />
            </div>
          ) : (
            <DeckDone
              setCurrentCard={setCurrentCard}
              currentResults={currentResults}
              setCurrentResults={setCurrentResults}
              isTyping={workSelected.typing}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleDeck;
