import { pokeApi } from "../../config/api/pokeApi";
import type { PokeAPIPaginatedResponse } from "../../infrastructure/interfaces/pokeapi.interfaces";

export const getPokemosToSearch = async () => {

  try {

    const url = '/pokemon';

    const { data } = await pokeApi.get<PokeAPIPaginatedResponse>(url, {
      params: {
        limit: 10000
      }
    });

    return data.results.map((info) => ({
      id: Number(info.url.split('/')[6]),
      name: info.name
    }));
  } catch (error) {
    console.log(error);
    throw new Error('Error getting pokemons to search')
  }

}