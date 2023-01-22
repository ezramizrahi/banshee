const data = require('./data.json');

test('that movie key exists in all objs', () => {
    let expectedVal = data.every(d => 'movie' in d && typeof d.movie === "string");
    expect(expectedVal).toBe(true);
});

test('that rating key exists in all objs', () => {
    let expectedVal = data.every(d => 'rating' in d && typeof d.rating === "string");
    expect(expectedVal).toBe(true);
});

test('that summary key exists in all objs', () => {
    let expectedVal = data.every(d => 'summary' in d && typeof d.summary === "string");
    expect(expectedVal).toBe(true);
});

test('that times key exists in all objs', () => {
    let expectedVal = data.every(d => 'times' in d && Array.isArray(d.times));
    expect(expectedVal).toBe(true);
});

test('that scraped_at key exists in all objs', () => {
    let expectedVal = data.every(d => 'scraped_at' in d && typeof d.scraped_at === "string");
    expect(expectedVal).toBe(true);
});