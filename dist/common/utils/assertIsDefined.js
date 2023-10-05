export function assertIsDefined(val) {
    if (!val) {
        throw Error(`Expected 'val' to be defined, but received ${val}`);
    }
}
