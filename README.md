# Modular Idle

The project is far from finished, and I may or may not decide to continue... :)

## Description

A minimal idle game (an excuse to learn typescript, consolidate my web-dev knowledge and mess around with Cordova). The mechanic is very simple: you have 4 classes of stuff

1. **Resources**, which are produced by workers and consuming other resources
2. **Storage**, which you can buy to increase the max amount or resources (or build houses for workers)
3. **Facilities**, which you can buy to allow and increase the resource production (by having more max workers)
4. **Population**, in other words different types of workers that need to be created and mantained (with resources)
5. **Knowledge**, a section where you can buy the possibility of building new structures

The idea is that you describe how this 4 elements are related to each other in a JSON file (or whatever, for that matters) and the game is built around that. 

There is no graphic whatsoever (except of the game icon) and I don't really plan on adding it since it's a toy project for learning.


## Developing

The project uses [Cordova](https://cordova.apache.org/docs/en/latest/), [Tailwindcss](https://tailwindcss.com/) and [Typescript](https://www.typescriptlang.org/). For the rest, it's a static one page html.

The source code is located the `www` folder. It's really messy and I changed idea about the overall design a few times.

Since I'm using [bun](https://bun.sh/) as a runtime Javascript runner (and as a packet manager) all the following command start with `bun`, but could easily changed to `npm`

- `bun start` to run the web version of the program (in watch mode)
- `bun check` to check for integrity of the `data.mts`, which contains the data used to generate the game.
