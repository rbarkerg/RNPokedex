import { pokeApi } from "../../config/api/pokeApi";
import { Pokemon } from "../../domain/models/pokemon";
import { PokeAPIPokemon } from "../../infrastructure/interfaces/pokeapi.interfaces";
import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mapper";



export const getPokemonBy = async (id: number): Promise<Pokemon> => {
  try {

    const url = `/pokemon/${id}`;

    const { data } = await pokeApi.get<PokeAPIPokemon>(url);

    return PokemonMapper.pokeApiPokemonToModel(data);

  } catch (error) {
    console.log(error);
    throw new Error(`Error getting pokemon by id: ${id}`)
  }
} 