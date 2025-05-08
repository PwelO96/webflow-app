/* eslint-disable @typescript-eslint/no-unused-vars */

import { cloneNode, isNotEmpty } from '@finsweet/ts-utils';

import type { PokemonData, PokemonResponse } from './utils/types';

window.Webflow ||= [];
window.Webflow.push(async () => {
  const inputLimit = document.querySelector<HTMLInputElement>('[data-element="input"]');
  const inputOffset = document.querySelector<HTMLInputElement>('[data-element="offset"]');
  if (!inputLimit || !inputOffset) return;

  const updatePokemons = async () => {
    const limit = Number(inputLimit.value) || 0;
    const offset = Number(inputOffset.value) || 0;

    const pokemonsData = await fetchPokemonsData(limit, offset);

    const itemTemplate = document.querySelector<HTMLAnchorElement>('[data-element="pokemon-item');
    if (!itemTemplate) return;

    const itemsList = itemTemplate.parentElement!;

    itemsList.innerHTML = '';

    itemTemplate.remove();

    const pokemonItems = pokemonsData.map(({ id, name, sprites }) => {
      const item = cloneNode(itemTemplate);

      const imageElement = item.querySelector<HTMLImageElement>('[data-element="pokemon-image"]');
      const idElement = item.querySelector<HTMLDivElement>('[data-element="pokemon-id"]');
      const nameElement = item.querySelector<HTMLDivElement>('[data-element="pokemon-name"]');

      if (imageElement) {
        imageElement.src = sprites.other?.dream_world.front_default || sprites.front_default;
      }

      if (idElement) {
        idElement.textContent = id.toString();
      }

      if (nameElement) {
        nameElement.textContent = name.toString();
      }

      item.removeAttribute('data-cloak');

      return item;
    });

    itemsList.append(...pokemonItems);
  };

  updatePokemons();

  inputLimit.addEventListener('input', updatePokemons);
  inputOffset.addEventListener('input', updatePokemons);
});

const fetchPokemonsData = async (limit: number, offset: number): Promise<PokemonData[]> => {
  try {
    const url = new URL('https://pokeapi.co/api/v2/pokemon');
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('offset', offset.toString());

    const response = await fetch(url);

    const data: PokemonResponse = await response.json();

    const pokemonsData = (
      await Promise.all(
        data.results.map(async ({ url }) => {
          try {
            const response = await fetch(url);
            const data: PokemonData = await response.json();

            return data;
          } catch (err) {
            return null;
          }
        })
      )
    ).filter(isNotEmpty);

    return pokemonsData;
  } catch (err) {
    return [];
  }
};
