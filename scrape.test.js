const data = require('./data.json');

test('movie key value is a string', () => {
    data.forEach(d => {
        expect(d.movie).toEqual(expect.any(String));
    });
});

test('rating key value is a string', () => {
    data.forEach(d => {
        expect(d.rating).toEqual(expect.any(String));
    });
});

test('summary key value is a string', () => {
    data.forEach(d => {
        expect(d.summary).toEqual(expect.any(String));
    });
});

test('times key value is an array of strings', () => {
    data.forEach(d => {
        expect(d.times).toEqual(expect.any(Array));
    });
});

test('that scraped_at key exists in all objs', () => {
    data.forEach(d => {
        expect(d.scraped_at).toEqual(expect.any(String));
    });
});