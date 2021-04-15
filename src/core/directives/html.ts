import compile from '../../core/compile';
import { directives } from '../../core/directive';
import render from '../../core/render';
import { DirectiveProps } from '../../models/structs';
import adjustDeps from '../utils/adjustDeps';
import { getElementCustomProp, setElementCustomProp } from '../utils/elementCustomProp';

export const htmlDirective = ({ el, data, state, node }: DirectiveProps): void => {
  node = node!;
  const marker = getElementCustomProp(el, 'component');

  // Handle naked prop in expression case
  el.innerHTML = data.compute(state) ?? data.value;

  const ast = compile(el, state, true);

  if (!marker) adjustDeps(ast, data.deps, node, 'html');

  render(ast, directives, state, data.deps);

  setElementCustomProp(el, 'component', true);
};
