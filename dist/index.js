"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // node_modules/.pnpm/@finsweet+ts-utils@0.40.0/node_modules/@finsweet/ts-utils/dist/type-guards/isNotEmpty.js
  var isNotEmpty = (value) => value !== void 0 && value !== null;

  // node_modules/.pnpm/@finsweet+ts-utils@0.40.0/node_modules/@finsweet/ts-utils/dist/helpers/cloneNode.js
  var cloneNode = (node, deep = true) => node.cloneNode(deep);

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(async () => {
    const inputLimit = document.querySelector('[data-element="input"]');
    const inputOffset = document.querySelector('[data-element="offset"]');
    if (!inputLimit || !inputOffset) return;
    const updatePokemons = async () => {
      const limit = Number(inputLimit.value) || 0;
      const offset = Number(inputOffset.value) || 0;
      const pokemonsData = await fetchPokemonsData(limit, offset);
      const itemTemplate = document.querySelector('[data-element="pokemon-item');
      if (!itemTemplate) return;
      const itemsList = itemTemplate.parentElement;
      itemsList.innerHTML = "";
      itemTemplate.remove();
      const pokemonItems = pokemonsData.map(({ id, name, sprites }) => {
        const item = cloneNode(itemTemplate);
        const imageElement = item.querySelector('[data-element="pokemon-image"]');
        const idElement = item.querySelector('[data-element="pokemon-id"]');
        const nameElement = item.querySelector('[data-element="pokemon-name"]');
        if (imageElement) {
          imageElement.src = sprites.other?.dream_world.front_default || sprites.front_default;
        }
        if (idElement) {
          idElement.textContent = id.toString();
        }
        if (nameElement) {
          nameElement.textContent = name.toString();
        }
        item.removeAttribute("data-cloak");
        return item;
      });
      itemsList.append(...pokemonItems);
    };
    updatePokemons();
    inputLimit.addEventListener("input", updatePokemons);
    inputOffset.addEventListener("input", updatePokemons);
  });
  var fetchPokemonsData = async (limit, offset) => {
    try {
      const url = new URL("https://pokeapi.co/api/v2/pokemon");
      url.searchParams.append("limit", limit.toString());
      url.searchParams.append("offset", offset.toString());
      const response = await fetch(url);
      const data = await response.json();
      const pokemonsData = (await Promise.all(
        data.results.map(async ({ url: url2 }) => {
          try {
            const response2 = await fetch(url2);
            const data2 = await response2.json();
            return data2;
          } catch (err) {
            return null;
          }
        })
      )).filter(isNotEmpty);
      return pokemonsData;
    } catch (err) {
      return [];
    }
  };
})();
//# sourceMappingURL=index.js.map
