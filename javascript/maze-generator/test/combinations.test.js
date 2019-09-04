describe('test', () => {
    test('combinations of empty list', () => {
        expect(combinations([])).toEqual([[]]);
    });

    test('combinations of 1 item', () => {
        expect(combinations([1])).toEqual([[1], []]);
    });

    test('combinations of 2 item', () => {
        expect(combinations([1, 2])).toEqual([[1], [1, 2], [2], []]);
    });

    test('combinations of 3 item', () => {
        expect(combinations([1, 2, 3])).toEqual([[1], [1, 2], [2], [1,3], [1,2,3], [2,3], [3], []]);
    });

    test('combinations of 3 item with a repeated item', () => {
        expect(combinations([4, 4, 5])).toEqual([[4], [4, 4], [4], [4,5], [4,4,5], [4,5], [5], []]);
    });
});

function powerSets(List, Set, index) {
    if (List.length === 0 || index === List.length) {
        return Set
    }

    const element = List[index];
    const setCombinedWithElement = Set.map(combination => {
        return combination.concat(element)
    });

    const newSet = Set.concat(setCombinedWithElement);
    newSet.push([element]);

    return powerSets(List, newSet, index + 1)
}

function combinations(List) {
    const Set = [];
    const result = powerSets(List, Set, 0);
    result.push([]);
    return result
}