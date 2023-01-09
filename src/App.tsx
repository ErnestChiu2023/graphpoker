import React, { useState } from "react";
import { Button, Col, Row, Typography } from "antd";
import { scoreHand } from "./score";
import { Card, Suit } from "./types";

type PlayerName =
  | 'Jes'
  | 'Nick'
  | 'Lewis'
  | 'Irfan'
  | 'Kerry'
  | 'Jim'
  | 'Gary'
;

interface PlayerState {
  name: PlayerName;
  hand: Card[];
}

interface GameState {
  players: PlayerState[];
}

const EMOJIS: Record<PlayerName, string> = {
  'Jes': '🐕',
  'Nick': '🐈',
  'Lewis': '⚡',
  'Irfan': '🌊',
  'Kerry': '🚲',
  'Jim': '🎹',
  'Gary': '🎵',
};

// Create a deck of cards
const DECK: Card[] = [
  { suit: "clubs", value: "2" },
  { suit: "clubs", value: "3" },
  { suit: "clubs", value: "4" },
  { suit: "clubs", value: "5" },
  { suit: "clubs", value: "6" },
  { suit: "clubs", value: "7" },
  { suit: "clubs", value: "8" },
  { suit: "clubs", value: "9" },
  { suit: "clubs", value: "10" },
  { suit: "clubs", value: "J" },
  { suit: "clubs", value: "Q" },
  { suit: "clubs", value: "K" },
  { suit: "clubs", value: "A" },
  { suit: "diamonds", value: "2" },
  { suit: "diamonds", value: "3" },
  { suit: "diamonds", value: "4" },
  { suit: "diamonds", value: "5" },
  { suit: "diamonds", value: "6" },
  { suit: "diamonds", value: "7" },
  { suit: "diamonds", value: "8" },
  { suit: "diamonds", value: "9" },
  { suit: "diamonds", value: "10" },
  { suit: "diamonds", value: "J" },
  { suit: "diamonds", value: "Q" },
  { suit: "diamonds", value: "K" },
  { suit: "diamonds", value: "A" },
  { suit: "hearts", value: "2" },
  { suit: "hearts", value: "3" },
  { suit: "hearts", value: "4" },
  { suit: "hearts", value: "5" },
  { suit: "hearts", value: "6" },
  { suit: "hearts", value: "7" },
  { suit: "hearts", value: "8" },
  { suit: "hearts", value: "9" },
  { suit: "hearts", value: "10" },
  { suit: "hearts", value: "J" },
  { suit: "hearts", value: "Q" },
  { suit: "hearts", value: "K" },
  { suit: "hearts", value: "A" },
  { suit: "spades", value: "2" },
  { suit: "spades", value: "3" },
  { suit: "spades", value: "4" },
  { suit: "spades", value: "5" },
  { suit: "spades", value: "6" },
  { suit: "spades", value: "7" },
  { suit: "spades", value: "8" },
  { suit: "spades", value: "9" },
  { suit: "spades", value: "10" },
  { suit: "spades", value: "J" },
  { suit: "spades", value: "Q" },
  { suit: "spades", value: "K" },
  { suit: "spades", value: "A" },
];

const getCard = () => {
  // Generate a random index between 0 and the length of the deck
  const index = Math.floor(Math.random() * DECK.length);
  return DECK[index];
};

const getDefaultPlayers: () => PlayerState[] = () => {
  return [
    { name: "Jes", hand: [] },
    { name: "Nick", hand: [] },
    { name: "Lewis", hand: [] },
    { name: "Kerry", hand: [] },
    { name: "Irfan", hand: [] },
    // { name: "Ryan", hand: [] },
    // { name: "Ernest", hand: [] },
    // { name: "Bjon", hand: [] },
    { name: "Jim", hand: [] },
    { name: "Gary", hand: [] },
  ];
};

const PokerApp = () => {
  // Use React's useState hook to keep track of the game state,
  // including the players and their hands
  const [gameState, setGameState] = useState<GameState>({
    players: JSON.parse(localStorage.getItem("players") as any) || getDefaultPlayers(),
  });

  const resetPlayers = () => {
    setGameState({
      ...gameState,
      players: getDefaultPlayers(),
    });
    localStorage.removeItem("players");
  };

  // Create a function to draw a card for each player
  const drawCards = () => {
    const players = gameState.players.map((p) => {
      // Add the card to the player's hand
      return {...p, hand: [...p.hand, getCard()]};
    });
    // Save the players' hands to local storage
    localStorage.setItem("players", JSON.stringify(players));

    // Update the game state with the new player hands
    setGameState({...gameState, players});
  };

  const removeCard = (playerName: PlayerName, index: number) => {
    // Update the player's hand in the players array
    const players = gameState.players.map((p) =>
      p.name === playerName ? { ...p, hand: p.hand.filter((card, i) => i !== index)} : p
    );
    // Save the player's hands to local storage
    localStorage.setItem("players", JSON.stringify(players));

    setGameState({
      ...gameState,
      players: players,
    });
  };

  // Create a function to draw a card for a player
  const drawCard = (playerName: PlayerName) => {
    const players = gameState.players.map((p) => {
      if (p.name === playerName) {
        // Add the card to the player's hand
        return {...p, hand: [...p.hand, getCard()]};
      } else {
        return p;
      }
    });
    // Save the player's hands to local storage
    localStorage.setItem("players", JSON.stringify(players));

    // Update the game state with the new player hands
    setGameState({...gameState, players});
  };

  const renderSuit = (suit: Suit) => {
    if (suit === "hearts") {
      return <h3 style={{ display: "inline", color: "red" }}>♥️</h3>;
    } else if (suit === "spades") {
      return <h3 style={{ display: "inline" }}>♠️</h3>;
    } else if (suit === "clubs") {
      return <h3 style={{ display: "inline" }}>♣️</h3>;
    } else {
      return <h3 style={{ display: "inline", color: "red" }}>♦️</h3>;
    }
  };

  return (
    <div style={{ margin: "30px" }}>
      <Typography.Title level={2} style={{ marginBottom: "10px" }}>
        Graph Poker 🦒
      </Typography.Title>
      {/* Render the player names and their hands */}
      <Button
        onClick={drawCards}
        style={{ marginRight: "5px" }}
        disabled={
          5 <=
          Math.max(...gameState.players.map((player) => player.hand.length))
        }
      >
        Draw cards
      </Button>
      <Button onClick={resetPlayers}>Clear Board</Button>
      {gameState.players.map((player) => (
        <div key={player.name}>
          <h2>
            {player.name} <span>{EMOJIS[player.name]}</span>
          </h2>
          <h3>{scoreHand(player.hand)[1]}</h3>
          <Button
            onClick={() => drawCard(player.name)}
            disabled={5 <= player.hand.length}
          >
            Draw Card
          </Button>
          <div style={{ marginTop: "5px" }}>
            <Row gutter={8}>
              {player.hand.map((card, index) => (
                <Col span={1.5} key={index + card.suit + card.value}>
                  <Button
                    onClick={() => removeCard(player.name, index)}
                    style={{ width: "100px", height: "50px" }}
                  >
                    {card.value}
                    {renderSuit(card.suit)}
                  </Button>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PokerApp;
