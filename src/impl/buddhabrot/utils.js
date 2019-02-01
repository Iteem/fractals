export const getNumIterations = function(cr, ci, maxIterations)
{
  let zr = 0;
  let zi = 0;

  let it;
  for (it = 0; it < maxIterations; it++) {
    let xTmp = zr;
    zr = zr * zr - zi * zi;
    zi = 2 * xTmp * zi;

    zr += cr;
    zi += ci;

    if (zr*zr + zi*zi > 4*4) {
      break;
    }
  }
  return it;
};