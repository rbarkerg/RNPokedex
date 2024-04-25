import { pokeApi } from "../../config/api/pokeApi";
import type { Pokemon } from "../../domain/models/pokemon";
import type { PokeAPIPaginatedResponse, PokeAPIPokemon } from "../../infrastructure/interfaces/pokeapi.interfaces";
import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mapper";


export const getPokemos = async (page: number, limit: number = 20): Promise<Pokemon[]> => {

  try {

    const url = '/pokemon';

    const { data } = await pokeApi.get<PokeAPIPaginatedResponse>(url, {
      params: {
        offset: page * 20,
        limit
      }
    });

    const pokemonsPromises = data.results.map((info) => {
      return pokeApi.get<PokeAPIPokemon>(info.url);
    });

    const pokeApiPokemons = await Promise.all(pokemonsPromises);
    const pokemons = pokeApiPokemons.map(pokemon => PokemonMapper.pokeApiPokemonToModel(pokemon.data));

    return pokemons
  } catch (error) {
    console.log(error);
    throw new Error('Error getting pokemons')
  }

}