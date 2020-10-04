import observer from './observer';
import renderDirective from './directives';
import { getSelector, mapAttributes } from './helpers/selector';

class VDom {
  $vdom: Record<string, any> | null;
  $view: ProxyConstructor | Record<string, any> | any;

  constructor(data: Record<string, any>) {
    this.$vdom = null;
    this.$view = data;
  }

  public mount(el: string | HTMLElement) {
    this.$vdom = this.$buildVNode(typeof el === 'string' ? document.querySelector(el) : el);
    this.$view = observer(this.$view, this.$patch.bind(this), this.$vdom);

    this.$patch(this.$vdom, Object.keys(this.$view));
    return this.$view;
  }

  public $createVNode(
    el: string,
    {
      tagName,
      attributes = {},
      directives = {},
      children = [],
    }: {
      tagName: string;
      attributes: Record<string, string>;
      directives: Record<string, string>;
      children: any[];
    }
  ): Record<string, any> {
    return {
      el,
      tagName,
      attributes,
      directives,
      children,
    };
  }

  public $buildVNode(el: any, recurse: boolean = false): Record<any, any> | any {
    const children = [];
    const targetChildNodes = el.childNodes;

    for (const targetChildNode of targetChildNodes) {
      switch (targetChildNode.nodeType) {
        case Node.TEXT_NODE:
          children.push(targetChildNode.nodeValue);
          break;
        case Node.ELEMENT_NODE:
          const { attributes, directives } = mapAttributes(targetChildNode);
          children.push(
            this.$createVNode(getSelector(targetChildNode), {
              tagName: targetChildNode.tagName.toLowerCase(),
              attributes,
              directives,
              children: this.$buildVNode(targetChildNode, true),
            })
          );
          break;
      }
    }

    const { attributes, directives } = mapAttributes(el);

    if (recurse) return children;
    else {
      return this.$createVNode(getSelector(el), {
        tagName: el.tagName.toLowerCase(),
        attributes,
        directives,
        children,
      });
    }
  }

  public $patch(vnodes: any, keys: any[], recurse: any = false): Record<any, any> | any {
    // Is not able to handle <Array>.push()
    if (!vnodes) return;

    const view = { ...this.$view };
    for (let i = 0; i < vnodes.children.length; i++) {
      let vnode,
        { el: rootEl, directives } = vnodes.children[i];

      if (typeof vnode === 'string') continue;
      for (const name in directives) {
        const value = directives[name];

        for (const key of keys) {
          let hasKey = value.toString().includes(key);
          let hasKeyInFunction = false;

          for (const globalKey in view) {
            if (
              typeof view[globalKey] === 'function' &&
              view[globalKey].toString().includes(`this.${globalKey}`)
            ) {
              hasKeyInFunction = true;
              break;
            }
          }

          if (hasKey || hasKeyInFunction) {
            const el = document.querySelector(rootEl);

            renderDirective({
              el,
              name,
              value,
              view: this.$view,
            });

            try {
              el.removeAttribute(`*${name}`);
            } catch (err) {}
            break;
          }
        }
      }
      vnode = this.$patch(vnode, keys, true);
    }
    if (recurse) return vnodes;
  }
}

export default VDom;
