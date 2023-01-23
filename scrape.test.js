const data = require('./data.json');

test('movie is a string', () => {
    data.forEach(d => {
        expect(d.movie).toEqual(expect.any(String));
    });
});

test('rating is a string', () => {
    data.forEach(d => {
        expect(d.rating).toEqual(expect.any(String));
    });
});

test('summary is a string', () => {
    data.forEach(d => {
        expect(d.summary).toEqual(expect.any(String));
    });
});

test('times an array of strings', () => {
    data.forEach(d => {
        expect(d.times).toEqual(expect.any(Array));
        expect(d.times).toEqual(expect.arrayContaining(expect.any(String)));
    });
});

test('scraped_at is a string', () => {
    data.forEach(d => {
        expect(d.scraped_at).toEqual(expect.any(String));
    });
});