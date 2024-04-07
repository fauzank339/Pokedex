import  { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file for styling

interface Pokemon {
  name: string;
  type: string[];
  evolution: string;
  url : string
}

function App() {
  const [data, setData] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1000"
        );
        const pokemonData = await Promise.all(
          response.data.results.map(async (pokemon: any) => {
            const pokemonDetailResponse = await axios.get(pokemon.url);
            const typesResponse = pokemonDetailResponse.data.types;
            const types = typesResponse.map((type: any) => type.type.name);
            const evolvesTo =
              response.data.results.find((p: any) => p.name === pokemon.name)
                ?.name || null;
            return {
              name: pokemon.name,
              type: types,
              evolution: evolvesTo,
              url: pokemon.url // Make sure to include the URL in the Pokemon object
            };
          })
        );
  
        setData(pokemonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="pokedex">
      <h1>Pokédex</h1>
      <div className="pokemon-list">
        {data.map((pokemon, index) => (
          <div className="pokemon-card" key={index}>
            <p className="pokemon-name">Name: {pokemon.name}</p>
            <p className="pokemon-type">Type: {pokemon.type.join(", ")}</p>
            <p className="pokemon-evolution">Evolves To: {pokemon.evolution}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
