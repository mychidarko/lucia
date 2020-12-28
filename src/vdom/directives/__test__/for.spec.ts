import { forDirective } from '../for';
import compute from '../../utils/compute';

describe('.forDirective', () => {
  it('should join the state array into HTML', () => {
    const el = document.createElement('ul');
    const expression = `bar in this.foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    // @ts-ignore
    el.__l_for = '<li l-text="this.bar"></li>';
    forDirective({
      el,
      name: 'l-for',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerHTML).toBe(
      '<li l-text="this.foo[0]">bar</li><li l-text="this.foo[1]">bar</li><li l-text="this.foo[2]">bar</li>'
    );
  });

  it('should join as text', () => {
    const el = document.createElement('p');
    const expression = `bar in this.foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    // @ts-ignore
    el.__l_for = '';
    forDirective({
      el,
      name: 'l-for',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerHTML).toBe('barbarbar');
  });

  it('should provide both item and index upon request', () => {
    const el = document.createElement('p');
    const expression = `bar, i in this.foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    // @ts-ignore
    el.__l_for = '<li l-text="this.bar + this.i"></li>';
    forDirective({
      el,
      name: 'l-for',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerHTML).toBe(
      '<li l-text="this.foo[0] + 0">bar0</li><li l-text="this.foo[1] + 1">bar1</li><li l-text="this.foo[2] + 2">bar2</li>'
    );
  });

  it('should string together __l_for if item and index are not present', () => {
    const el = document.createElement('p');
    const expression = `in this.foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    // @ts-ignore
    el.__l_for = '<li></li>';
    forDirective({
      el,
      name: 'l-for',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: { state },
    });
    expect(el.innerHTML).toBe('<li></li><li></li><li></li>');
  });

  it('should allow creation of directives and components', () => {
    const el = document.createElement('p');
    const expression = `bar in this.foo`;
    const state = { foo: ['bar', 'bar', 'bar'] };
    // @ts-ignore
    el.__l_for = '';
    forDirective({
      el,
      name: 'l-for',
      data: { value: expression, compute: compute(expression, { $el: el }) },
      app: {
        state,
        components: {
          FOO() {},
        },
        directives: {
          FOO() {},
        },
      },
    });
    expect(el.innerHTML).toBe('barbarbar');
  });
});
