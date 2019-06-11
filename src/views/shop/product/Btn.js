import configs from '../../../configs.js'
export default class Btn {
  // 构造
  constructor(id, startPoint, targetPoint, speed, imgSrc, direction, cb) {
    this.btnele = document.createElement("img")
    this.id = id
    this.startPoint = startPoint
    this.targetPoint = targetPoint
    this.speed = speed
    this.imgSrc = imgSrc
    this.direction = direction || 'right'
    this.callback = cb
  }
  // 新建元素
  create() {
    if (this.imgSrc) {
      this.btnele.src = configs.imgURL + this.imgSrc
    } else {
      this.btnele.src = '../../static/imgs/my_default_img.png'
    }
    let scrollView = document.getElementById('scrollView')
    this.btnele.id = this.id
    this.btnele.style.position = 'absolute'
    this.btnele.style.zIndex = 1000
    this.btnele.style.borderRadius = '0.24rem'
    this.btnele.style.width = '0.48rem'
    this.btnele.style.height = '0.48rem'
    this.btnele.style.left = this.startPoint.X + 'px'
    this.btnele.style.top = this.startPoint.Y + 'px'
    scrollView.appendChild(this.btnele)
    this.moveToCar2()
  }
  // 销毁
  destroy() {
    let scrollView = document.getElementById('scrollView')
    scrollView.removeChild(this.btnele)
  }
  // 已知两点抛物线公式：x2=-2py 效果不是很好 
  moveToCar() {
    var x = this.startPoint.X
    var y = this.startPoint.Y
    // 纵向距离
    var yh = this.targetPoint.Y - y
    // 横向距离
    var xh = this.targetPoint.X - x
    var p = xh * xh / (-2 * yh)
    this.btnele.style.transform = "translate(" + x.toFixed(0) + "px, " + y.toFixed(0) + "px)"
    var timer = setInterval(() => {
      x += this.speed
      y = (x * x) / (-2 * p)
      if (x >= xh) {
        this.callback && this.callback()
        clearInterval(timer);
        this.destroy()
      } else {
        this.btnele.style.transform = "translate(" + x.toFixed(0) + "px, " + y.toFixed(0) + "px)"
      }
    }, 1);
  }
  // 已知三点抛物线公式 y= ax*x+bx+c
  moveToCar2() {
    var x2, y2
    if (this.direction == 'right') {
      x2 = this.startPoint.X + 40
      y2 = this.startPoint.Y - 20
    } else {
      x2 = this.startPoint.X - 40
      y2 = this.startPoint.Y - 20
    }
    var x1 = this.targetPoint.X
    var y1 = this.targetPoint.Y
    var x3 = this.startPoint.X
    var y3 = this.startPoint.Y

    var a = (x1 * (y3 - y2) + x2 * (y1 - y3) - x3 * (y1 - y2)) / ((x1 - x3) * (x1 * x1 - x2 * x2) - (x1 - x2) * (x1 *
      x1 - x3 * x3))
    var b = (y1 - y2 - a * (x1 * x1 - x2 * x2)) / (x1 - x2);
    var c = y1 - a * x1 * x1 - b * x1;

    var timer = setInterval(() => {
      var flag
      if (this.direction == 'right') {
        x3 += this.speed
        flag = (x3 >= x1)
      } else {
        x3 -= this.speed
        flag = (x3 <= x1)
      }
      this.btnele.style.left = x3 + 'px'
      this.btnele.style.top = a * x3 * x3 + b * x3 + c + 'px'
      if (flag) {
        this.callback && this.callback()
        window.clearInterval(timer);
        this.destroy()
      }
    }, 10);
  }
}
