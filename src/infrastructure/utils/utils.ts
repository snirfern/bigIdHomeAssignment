interface WordOffsets {
    offsets: number[];
    article_id?: string;
}

export function extractWordsOffsets(str: string): { [key: string]: WordOffsets } {
    const wordsDict: { [key: string]: WordOffsets } = {};
    let word = '', offset = -1;

    for (let i = 0; i <= str.length; i++) {
        const char = str[i] || ' ';
        if (char === ' ') {
            if (word) {
                if (!wordsDict[word]) {
                    wordsDict[word] = {offsets: []};
                }
                wordsDict[word].offsets.push(offset);
                word = '';
            }
        } else {
            if (word === '') offset = i;
            word += char;
        }
    }

    return wordsDict;
}
