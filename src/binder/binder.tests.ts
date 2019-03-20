import { binder } from './binder';

describe('binder', () => {

  it('returns the same function every time it is called', () => {
    const target = {};

    const binderFuncs: Function[] = [];
    const createFunc = () => {
      const binderFunc = () => void 0;
      binderFuncs.push(binderFunc);
      return binder(target, binderFunc);
    };

    const getFunc = createFunc();
    const getFunc2 = createFunc();
    expect(getFunc).to.eq(getFunc2);
    expect(binderFuncs).to.have.lengthOf(2);
    expect(binderFuncs[0]).not.to.eq(binderFuncs[1]);
  });

  it('does not record values of variables within closures', () => {
    const target = {};
    let valueToReturn = 10;
    const getFunc = binder(target, () => valueToReturn);

    let value = getFunc();
    expect(value).to.eq(10);
    valueToReturn = 20;
    value = getFunc();
    expect(value).to.eq(20);
  });

});
