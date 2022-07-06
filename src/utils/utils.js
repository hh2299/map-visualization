// util.js
// 射线判断函数
export function rayCasting(p, poly) {
  let px = p[0],
      py = p[1],
      flag = false

  // console.log("poly.length：" + poly.length);
  // console.log("进来了rayCasting函数");

  for(let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {

    // console.log("进来了rayCasting中的for循环")

    let sx = poly[i][0],
        sy = poly[i][1],
        tx = poly[j][0],
        ty = poly[j][1]

    // 点与多边形顶点重合
    if((sx === px && sy === py) || (tx === px && ty === py)) {
      return true
    }

    // 点的射线和多边形的一条边重合，并且点在边上
    if((sy === ty && sy === py) && ((sx > px && tx < px) || (sx < px && tx > px))) {
      return true
    }

    // 判断线段两端点是否在射线两侧
    if((sy < py && ty >= py) || (sy >= py && ty < py)) {
      // 线段上与射线 Y 坐标相同的点的 X 坐标
      let x = sx + (py - sy) * (tx - sx) / (ty - sy)

      // 点在多边形的边上
      if(x === px) {
        return true
      }

      // 射线穿过多边形的边界
      if(x > px) {
        flag = !flag
      }
    }
  }

  // 射线穿过多边形边界的次数为奇数时点在多边形内
  return flag ? true : false
}

//判断点有没有在某个行政区
export function isPointInAreas(p, mapJson) {
  const areas = mapJson.features
  let flag = false
  for(let i = 0; i < areas.length; i++) {
    // console.log("这个for循环没有进来吗")
    if(rayCasting(p, areas[i].geometry.coordinates[0])) {
      flag = true
      break
    }
  }
  return flag
}
