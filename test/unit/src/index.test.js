import { expect } from 'chai';
import { nonStringValues } from 'stash-it-test-helpers';

import createPrefixSuffixPlugin from '../../../src/index';

const cacheInstance = {};
const key = 'key';
const prefix = 'prefix_';
const suffix = '_suffix';
const payloadWithPrefixAndSuffix = { prefix, suffix };
const handlersPayload = { cacheInstance, key };

describe('Prefix / suffix plugin', () => {
    describe('validation', () => {
        context('when both prefix and suffix are not passed (at least one is required)', () => {
            it('should throw', () => {
                expect(createPrefixSuffixPlugin.bind(null))
                    .to.throw('You need to pass either `prefix` or `suffix` or both.');
            });
        });

        context('when prefix is passed and is not a string', () => {
            nonStringValues.forEach((value) => {
                expect(createPrefixSuffixPlugin.bind(null, { prefix: value }))
                    .to.throw('`prefix` must be a string.');
            });
        });

        context('when suffix is passed and is not a string', () => {
            nonStringValues.forEach((value) => {
                expect(createPrefixSuffixPlugin.bind(null, { suffix: value }))
                    .to.throw('`suffix` must be a string.');
            });
        });
    });

    describe('hooks', () => {
        it('should be an array', () => {
            const plugin = createPrefixSuffixPlugin(payloadWithPrefixAndSuffix);

            expect(plugin.hooks).to.be.an('array');
        });

        describe('preBuildKey hook', () => {
            const createPreBuildKeyHook = (plugin = createPrefixSuffixPlugin(payloadWithPrefixAndSuffix)) => {
                const hooks = plugin.hooks;
                const preBuildKeyHook = hooks[0];

                return preBuildKeyHook;
            };

            const createPreBuildKeyHandler = (plugin) => {
                const preBuildKeyHook = createPreBuildKeyHook(plugin);
                const handler = preBuildKeyHook.handler;

                return handler;
            };

            it('should be present', () => {
                const preBuildKeyHook = createPreBuildKeyHook();

                expect(preBuildKeyHook.event).to.equal('preBuildKey');
            });

            describe('event handler', () => {
                it('should be a function', () => {
                    const preBuildKeyHandler = createPreBuildKeyHandler();

                    expect(preBuildKeyHandler).to.be.a('function');
                });

                it('should return an object with cacheInstance and key properties', () => {
                    const preBuildKeyHandler = createPreBuildKeyHandler();
                    const returnedValue = preBuildKeyHandler(handlersPayload);

                    expect(returnedValue).to.have.all.keys([ 'cacheInstance', 'key' ]);
                });

                it('should return an object with unchanged cacheInstance', () => {
                    const preBuildKeyHandler = createPreBuildKeyHandler();
                    const returnedValue = preBuildKeyHandler(handlersPayload);

                    expect(returnedValue.cacheInstance).to.equal(handlersPayload.cacheInstance);
                });

                context('when only prefix is passed', () => {
                    it('should return prefixed key', () => {
                        const plugin = createPrefixSuffixPlugin({ prefix });
                        const preBuildKeyHandler = createPreBuildKeyHandler(plugin);
                        const returnedValue = preBuildKeyHandler(handlersPayload);

                        expect(returnedValue.key).to.equal('prefix_key');
                    });
                });

                context('when only suffix is passed', () => {
                    it('should return suffixed key', () => {
                        const plugin = createPrefixSuffixPlugin({ suffix });
                        const preBuildKeyHandler = createPreBuildKeyHandler(plugin);
                        const returnedValue = preBuildKeyHandler(handlersPayload);

                        expect(returnedValue.key).to.equal('key_suffix');
                    });
                });

                context('when both prefix and suffix are passed', () => {
                    it('should return prefixed and suffixed key', () => {
                        const plugin = createPrefixSuffixPlugin({ prefix, suffix });
                        const preBuildKeyHandler = createPreBuildKeyHandler(plugin);
                        const returnedValue = preBuildKeyHandler(handlersPayload);

                        expect(returnedValue.key).to.equal('prefix_key_suffix');
                    });
                });
            });
        });
    });

    describe('createExtensions', () => {
        it('should be a function', () => {
            const plugin = createPrefixSuffixPlugin({ prefix, suffix });

            expect(plugin.createExtensions).to.be.a('function');
        });

        describe('getPrefix', () => {
            it(`should return prefix passed upon plugin's construction`, () => {
                const plugin = createPrefixSuffixPlugin({ prefix });
                const extensions = plugin.createExtensions({ cacheInstance });

                expect(extensions.getPrefix()).to.equal(prefix);
            });
        });

        describe('getSuffix', () => {
            it(`should return suffix passed upon plugin's construction`, () => {
                const plugin = createPrefixSuffixPlugin({ suffix });
                const extensions = plugin.createExtensions({ cacheInstance });

                expect(extensions.getSuffix()).to.equal(suffix);
            });
        });

        context('when plugin was already once registered (it can be used multiple times)', () => {
            it('should return object with no extensions (to not try to overwrite existing ones)', () => {
                const cacheInstanceDouble = {
                    getPrefix: () => {},
                    getSuffix: () => {}
                };

                const plugin = createPrefixSuffixPlugin({ prefix, suffix });
                const extensions = plugin.createExtensions({ cacheInstance: cacheInstanceDouble});

                expect(extensions).to.deep.equal({});
            });
        });
    });
});
