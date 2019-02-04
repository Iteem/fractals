import {getNumIterations} from '../../../services/utils';

// 50 is enough at the resolution of the importanceMap
const kdTreeMinIterations = 50;
const maxDepth = 17;
const maxNoChanges = 4;

export default class KdTreeSampler {
  constructor(left, top, width, height){
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    //this.left = 0;
    //this.top = -2;
    //this.width = 1.2;
    //this.height = 2.6;


    //this.tree = KdTreeSampler.getKdTree(0, -2, 1.2, 2.6, 0, 0, 0)
    this.tree = KdTreeSampler.getKdTree(this.left, this.top, this.width, this.height, 0, 0, 0)
  }

  getSample()
  {
    return this.getSampleIterative(this.tree, this.left, this.top, this.width, this.height);
  }

  getSampleIterative(tree, left, top, width, height)
  {
    if(!tree.children){
      return {
        ci: left + Math.random() * width,
        cr: top + Math.random() * height,
        importance: tree.importance
      };
    }

    const lhsImportance = tree.children[0].importance;
    const rhsImportance = tree.children[1].importance;
    let goLeft = Math.random() * (lhsImportance + rhsImportance) < lhsImportance;
    if(width < height){
      return goLeft ?
        this.getSampleIterative(tree.children[0], left, top, width, height / 2) :
        this.getSampleIterative(tree.children[1], left, top + height / 2, width, height / 2);
    } else {
      return goLeft ?
        this.getSampleIterative(tree.children[0], left, top, width / 2, height) :
        this.getSampleIterative(tree.children[1], left + width / 2, top, width / 2, height);
    }
  }

  static getKdTree(left, top, width, height, depth, lastChange, parentIterations)
  {
    const maxIterations = kdTreeMinIterations + Math.floor(1 / Math.min(width, height));
    const it = getNumIterations(top + width / 2, left + height / 2, maxIterations);
    const its = [];
    its.push(it);
    its.push(getNumIterations(top + width / 2, left + 3 * height / 2, maxIterations));
    its.push(getNumIterations(top + width / 2, left - height / 2, maxIterations));
    its.push(getNumIterations(top + 3 * width / 2, left + height / 2, maxIterations));
    its.push(getNumIterations(top - width / 2, left + height / 2, maxIterations));

    if(its.some((i) => Math.abs(i - parentIterations) > 0)){
      lastChange = 0;
      parentIterations = it;
    } else {
      lastChange++;
    }

    if(depth >= maxDepth || lastChange >= maxNoChanges) {
      // Only if all checked neighbours are part we can be relatively sure the whole block is and not sample it.
      return { importance: Math.sqrt(its.reduce((acc, cur) => (cur !== maxIterations ? Math.max(acc, cur) : acc), 0)) }
    }

    let lhs, rhs;
    if(width < height){
      lhs = KdTreeSampler.getKdTree(left, top, width, height / 2, depth + 1, lastChange, parentIterations);
      rhs = KdTreeSampler.getKdTree(left, top + height / 2, width, height / 2, depth + 1, lastChange, parentIterations);
    } else {
      lhs = KdTreeSampler.getKdTree(left, top, width / 2, height, depth + 1, lastChange, parentIterations);
      rhs = KdTreeSampler.getKdTree(left + width / 2, top, width / 2, height, depth + 1, lastChange, parentIterations);
    }

    if(!lhs.children && !rhs.children && Math.abs(lhs.importance - rhs.importance) <= 1){
      return {
        importance: (lhs.importance + rhs.importance) / 2
      }
    }

    return {
      children: [lhs, rhs],
      importance: (lhs.importance + rhs.importance) / 2
    }
  }

  static drawTree(ctx, tree, left, top, width, height, depth)
  {
    const f = 750;
    if(!tree.children){
      ctx.fillStyle = `rgb(${Math.floor(25 * tree.importance % 255)}, 0, ${Math.floor(5 * tree.importance % 255)})`;
      ctx.fillRect(Math.floor((top + 1.8) * f ), Math.floor(left * f), Math.ceil(height * f), Math.ceil(width * f));
      return;
    }

    if(width < height){
      KdTreeSampler.drawTree(ctx, tree.children[0], left, top, width, height / 2, depth + 1);
      KdTreeSampler.drawTree(ctx, tree.children[1], left, top + height / 2, width, height / 2, depth + 1);
    } else {
      KdTreeSampler.drawTree(ctx, tree.children[0], left, top, width / 2, height, depth + 1);
      KdTreeSampler.drawTree(ctx, tree.children[1], left + width / 2, top, width / 2, height, depth + 1);
    }
  }

  static getNumNodes(tree){
    if(tree.children) {
      return KdTreeSampler.getNumNodes(tree.children[0]) + KdTreeSampler.getNumNodes(tree.children[1]);
    }
    return 1;
  }
}