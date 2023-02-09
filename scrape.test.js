const data = require('./data.json');

describe('schema validation', () => {
    //  don't really need this as mongoose has schema validation
    test('movie is a string', () => {
        data.forEach(d => {
            expect(d).toHaveProperty('movie');
            expect(d.movie).toEqual(expect.any(String));
        });
    });
    
    test('summary is a string', () => {
        data.forEach(d => {
            expect(d).toHaveProperty('summary');
            expect(d.summary).toEqual(expect.any(String));
        });
    });
    
    test('times is an array of strings', () => {
        data.forEach(d => {
            expect(d).toHaveProperty('times');
            expect(d.times).toEqual(expect.any(Array));
        });
    });
    
    test('cast is an array of strings', () => {
        data.forEach(d => {
            expect(d).toHaveProperty('cast');
            expect(d.cast).toEqual(expect.any(Array));
        });
    });
    
    test('scraped_at is a string', () => {
        data.forEach(d => {
            expect(d).toHaveProperty('scraped_at');
            expect(d.scraped_at).toEqual(expect.any(String));
        });
    });
  });