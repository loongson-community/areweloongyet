import { Nodes, PhrasingContent } from 'mdast'
import { findAndReplace } from 'mdast-util-find-and-replace'

function produceErhuaMark(match: any): PhrasingContent {
  // this won't work
  // return { type: 'html', value: '<small>儿</small>' }
  //
  // instead we have to adopt the undocumented way as remark-emoji:
  return {
    type: 'text',
    value: '',
    data: {
        hName: 'small',
        hChildren: [{ type: 'text', value: '儿' }],
    },
  }
}

export default function plugin(options: any) {
  return (tree: Nodes) => {
    findAndReplace(tree, [
      [":儿:", produceErhuaMark],
      [":ta:", "tā"],
    ])
  }
}
