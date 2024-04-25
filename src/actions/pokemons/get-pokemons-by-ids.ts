import { getPokemonBy } from ".";
import { Pokemon } from "../../domain/models/pokemon";


export const getPokemonsByIds = async (ids: number[]): Promise<Pokemon[]> => {
  try {

    const pokemonsPromise: Promise<Pokemon>[] = ids.map(id => {
      return getPokemonBy(id);
    });

    return Promise.all(pokemonsPromise);

  } catch (error) {
    console.log(error);
    throw new Error('Error getting pokemons by ids')
  }
}