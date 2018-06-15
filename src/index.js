export default function prefixSuffix(options) {
    const hasPrefix = options && options.hasOwnProperty('prefix');
    const hasSuffix = options && options.hasOwnProperty('suffix');

    if (!options || (!hasPrefix && !hasSuffix)) {
        throw new Error('You need to pass either `prefix` or `suffix` or both.');
    }

    const { prefix, suffix } = options;

    if (hasPrefix && typeof prefix !== 'string') {
        throw new Error('`prefix` must be a string.');
    }

    if (hasSuffix && typeof suffix !== 'string') {
        throw new Error('`suffix` must be a string.');
    }

    return {
        hooks: [
            {
                event: 'preBuildKey',
                handler: ({ cacheInstance, key }) => {
                    const builtKey = `${prefix ? prefix : ''}${key}${suffix ? suffix : ''}`;

                    return { cacheInstance, key: builtKey };
                }
            }
        ]
    };
}
