![logo-stash-it-color-dark 2x](https://user-images.githubusercontent.com/1819138/30385483-99fd209c-98a7-11e7-85e2-595791d8d894.png)

# stash-it-plugin-prefixSuffix

[![build status](https://img.shields.io/travis/smolak/stash-it-plugin-prefixSuffix/master.svg?style=flat-square)](https://travis-ci.org/smolak/stash-it-plugin-prefixSuffix)
[![Coverage Status](https://coveralls.io/repos/github/smolak/stash-it-plugin-prefixSuffix/badge.svg?branch=master)](https://coveralls.io/github/smolak/stash-it-plugin-prefixSuffix)


Prefix / suffix plugin for [stash-it](https://www.npmjs.com/package/stash-it).

## The problem

Imagine there are couple of teams working on a product that uses **stash-it**
and the same storage. Each team would like to use any keys to store
the items, and not to be worried that some names are already taken.

## Solution

Using this plugin, you're able to create cache instances that will make sure
that all of the keys you use will have (either or both) prefix / suffix
of your choosing included automatically.

## Installation

```sh
npm i stash-it-plugin-prefixsuffix --save
```

## Usage

```javascript
import { createCache } from 'stash-it';
import createPrefixSuffixPlugin from 'stash-it-plugin-prefixsuffix';

// You can use any adapter
import createMemoryAdapter from 'stash-it-adapter-memory';

const team1Prefix = 'team1';
const team2Prefix = 'team2';
const cache = createCache(createMemoryAdapter());

const team1PrefixPlugin = createPrefixSuffixPlugin({ prefix: team1Prefix });
const team2PrefixPlugin = createPrefixSuffixPlugin({ prefix: team2Prefix });

const team1CacheInstance = cache.registerPlugins([ team1PrefixPlugin ]);
const team2CacheInstance = cache.registerPlugins([ team2PrefixPlugin ]);

// TEAM 1
team1CacheInstance.hasKey('key'); // false
team1CacheInstance.setItem('key', '11_TEAM_11');

const item = team1CacheInstance.getItem('key');

item.value; // 11_TEAM_11
item.key; // team1key

// TEAM 2
team2CacheInstance.hasKey('key'); // false
team2CacheInstance.setItem('key', '22_TEAM_22');

const item = team2CacheInstance.getItem('key');

item.value; // 22_TEAM_22
item.key; // team2key
```

## API

Plugin takes an object, as an argument, upon creation. This object must contain
at least one of the properties: **prefix** and / or **suffix**.
Can have both.

```javascript
const plugin1 = createPrefixSuffixPlugin({ prefix, suffix }); // OK
const plugin2 = createPrefixSuffixPlugin({ prefix }); // OK
const plugin3 = createPrefixSuffixPlugin({ suffix }); // OK
const plugin4 = createPrefixSuffixPlugin(); // will throw
```

**prefix** and **suffix** must be a string, containing any characters
you want.

String(s) will be concatenated with `key` like so: `${prefix}${key}{$suffix}`.

But as a user, you only need to pass the `key` when using **stash-it**'s API.
