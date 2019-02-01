import {getNumIterations} from '../../../services/utils';

// 50 is enough at the resolution of the importanceMap
export const importanceMapMaxIterations = 50;

export default class ImportanceMapSampler {
  constructor(left, top, width, height){
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }

  static async getImportanceMap(xScale, yScale, width, height)
  {
    let importanceMap = (new Array(width * height)).fill(0);

    for (let y = 0; y < height; y++) {
      let cr = yScale(y);

      for (let x = 0; x < width; x++) {
        let ci = xScale(x);
        const it = getNumIterations(cr, ci, importanceMapMaxIterations);

        if (it < importanceMapMaxIterations) {
          const xx = Math.round(xScale.invert(ci));
          const yy = Math.round(yScale.invert(cr));
          if(yy >= 0 && yy < height) {
            if(xx >= 0 && xx < width) {
              // We take the number of iterations as importance, since samples of this region will be of interest.
              // Samples which escape fast are from the outer region and uniform, we don't want to waste time with them.
              importanceMap[xx + yy * width] += it;
            }
          }
        }
      }
      if (y % 25 === 0){
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    // "Blur" since at the edge we might get artifacts so we rather oversample
    importanceMap = importanceMap.map((d, i) => {
      let ret = 0;
      for(let dy = -1; dy <= 1; ++dy) {
        for (let dx = -1; dx <= 1; ++dx) {
          const index = i + dx + dy * width;
          if(index >= 0 && index < importanceMap.length){
            ret = Math.max(ret, importanceMap[index]);
          }
        }
      }
      return ret;
    });

    return importanceMap;
  }
}