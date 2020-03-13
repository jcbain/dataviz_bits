import {sayHello} from './helpers'

test('sayHello() says "hello"', () => {
    expect(sayHello()).toBe("hello")
})