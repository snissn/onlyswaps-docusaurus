function noMdxEsm() {
  return function transformer(tree) {
    function walk(node) {
      if (!node || !node.children) return;
      node.children = node.children
        .map((child) => {
          if (child.type === 'mdxjsEsm') {
            const code = child.value || '';
            return { type: 'code', lang: 'js', value: code };
          }
          walk(child);
          return child;
        })
        .filter(Boolean);
    }
    walk(tree);
  };
}

module.exports = noMdxEsm;
