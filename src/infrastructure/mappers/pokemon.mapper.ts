import { getGradient } from "../../config/helpers/get-gradient";
import { Move, Pokemon, Stat } from "../../domain/models/pokemon";
import { PokeAPIPokemon } from "../interfaces/pokeapi.interfaces";


export class PokemonMapper {

  static pokeApiPokemonToModel(data: PokeAPIPokemon): Pokemon {

    const sprites = PokemonMapper.getSprites(data);
    const avatar = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
    const types = data.types.map(type => type.type.name);
    const gradient = getGradient(types);
    const games = data.game_indices.map(game => game.version.name);
    const abilities = data.abilities.map(abilitie => abilitie.ability.name);

    const stats = data.stats.map<Stat>(stat => ({
      name: stat.stat.name,
      value: stat.base_stat
    }));

    const moves = data.moves.map<Move>(move => ({
      name: move.move.name,
      level: move.version_group_details[0].level_learned_at
    })).sort((a, b) => (a.level - b.level));


    return {
      id: data.id,
      name: data.name,
      types: types,
      avatar: avatar,
      sprites: sprites,
      colors: gradient,
      games: games,
      stats: stats,
      abilities: abilities,
      moves: moves
    }
  }

  static getSprites(data: PokeAPIPokemon): string[] {
    const sprites: string[] = [
      data.sprites.front_default,
      data.sprites.back_default,
      data.sprites.front_shiny,
      data.sprites.back_shiny,
    ];

    if (data.sprites.other?.home.front_default)
      sprites.push(data.sprites.other?.home.front_default);
    if (data.sprites.other?.['official-artwork'].front_default)
      sprites.push(data.sprites.other?.['official-artwork'].front_default);
    if (data.sprites.other?.['official-artwork'].front_shiny)
      sprites.push(data.sprites.other?.['official-artwork'].front_shiny);
    if (data.sprites.other?.showdown.front_default)
      sprites.push(data.sprites.other?.showdown.front_default);
    if (data.sprites.other?.showdown.back_default)
      sprites.push(data.sprites.other?.showdown.back_default);

    return sprites;
  }
}