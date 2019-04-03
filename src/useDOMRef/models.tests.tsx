import { HTMLTargetDelegate } from './models';

describe('useDOMRef > models', () => {

  describe('HTMLTargetDelegate', () => {

    it('can create a HTMLTargetDelegate', () => {
      let element: HTMLElement;
      const target = HTMLTargetDelegate.create(e => element = e);
      target('<div></div>' as any as HTMLElement);
      expect(element).to.be.a('string').and.to.eq('<div></div>');
    });

    it('can create and nest a HTMLTargetDelegate', () => {
      let element1: HTMLElement;
      let element2: HTMLElement;
      let element3: HTMLElement;
      const target1 = HTMLTargetDelegate.create(e => element1 = e);
      const target2 = HTMLTargetDelegate.create(e => element2 = e);
      const target3 = HTMLTargetDelegate.create(e => element3 = e);
      target3(target2(target1('<div></div>' as any as HTMLElement)));
      expect(element1).to.be.a('string').and.to.eq('<div></div>');
      expect(element2).to.be.a('string').and.to.eq('<div></div>');
      expect(element3).to.be.a('string').and.to.eq('<div></div>');
    });

    it('can create and nest a HTMLTargetDelegate when used in a ref way', () => {
      let element1: HTMLElement;
      let element2: HTMLElement;
      let element3: HTMLElement;
      const target1 = HTMLTargetDelegate.create(e => element1 = e);
      const target2 = HTMLTargetDelegate.create(e => element2 = e);
      const target3 = HTMLTargetDelegate.create(e => element3 = e);
      target3(target2(target1))('<div></div>' as any as HTMLElement);
      expect(element1).to.be.a('string').and.to.eq('<div></div>');
      expect(element2).to.be.a('string').and.to.eq('<div></div>');
      expect(element3).to.be.a('string').and.to.eq('<div></div>');
    });

    it('can intercept a HTMLTargetDelegate', () => {
      let element1: HTMLElement;
      let element2: HTMLElement;
      const target1 = HTMLTargetDelegate.create(e => element1 = e);
      const wrappedTarget = HTMLTargetDelegate.intercept(e => element2 = e, target1);
      wrappedTarget('<div></div>' as any as HTMLElement);
      expect(element1).to.be.a('string').and.to.eq('<div></div>');
      expect(element2).to.be.a('string').and.to.eq('<div></div>');
    });

  });

});
