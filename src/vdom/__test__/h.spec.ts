import h from '../h';

describe('.h', () => {
  it('should render VNodes', () => {
    const vdom = h('div');

    expect(JSON.stringify(vdom)).toBe(
      JSON.stringify({
        tag: 'div',
        data: {
          attributes: {},
          directives: {},
        },
        children: [],
        type: 0,
      })
    );
  });
});