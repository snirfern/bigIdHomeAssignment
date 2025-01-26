import { extractWordsOffsets } from "../../../../src/infrastructure/utils/utils";

describe('extractWordsOffsets', () => {
    it('should extract word offsets from a string', () => {
        const input = 'Hello world';
        const expected = {
            Hello: { offsets: [0] },
            world: { offsets: [6] }
        };
        expect(extractWordsOffsets(input)).toEqual(expected);
    });

    it('should handle multiple occurrences of the same word', () => {
        const input = 'test test hello test';
        const expected = {
            test: { offsets: [0, 5, 16] },
            hello: { offsets: [10] }
        };
        expect(extractWordsOffsets(input)).toEqual(expected);
    });

    it('should return empty object for empty string', () => {
        const input = '';
        const expected = {};
        expect(extractWordsOffsets(input)).toEqual(expected);
    });



    it('should handle single word string', () => {
        const input = 'word';
        const expected = {
            word: { offsets: [0] }
        };
        expect(extractWordsOffsets(input)).toEqual(expected);
    });


});
