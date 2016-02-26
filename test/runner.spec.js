import test from 'ava';

test('01 Pass', t => {
  t.same(1, 1);
});

test('01 Test Pass', t => {
    t.same([1, 2], [1, 2]);
});

console.log('something');
