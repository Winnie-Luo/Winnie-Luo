// 定义全局变量
let flowers = [];  // 存储所有花朵的数组
let flowerSize = 1;

class Flower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(0.5, 1.5);  // 随机大小
        this.petalColor = this.getRandomColor();  // 初始随机颜色
        this.vx = random(-2, 2);  // x方向速度
        this.vy = random(-2, 2);  // y方向速度
        this.hasCollided = false;  // 追踪是否刚发生碰撞
    }

    // 生成随机颜色
    getRandomColor() {
        return color(
            random(100, 255),  // R
            random(100, 255),  // G
            random(100, 255)   // B
        );
    }

    // 更新花朵位置
    update() {
        this.x += this.vx;
        this.y += this.vy;

        // 边界检查
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // 重置碰撞状态
        this.hasCollided = false;
    }

    // 绘制花朵
    draw() {
        push();
        translate(this.x, this.y);
        scale(this.size);

        // 花瓣
        fill(this.petalColor);
        noStroke();
        for (let i = 0; i < 8; i++) {
            push();
            rotate(TWO_PI * i / 8);
            ellipse(0, -30, 50, 80);
            pop();
        }

        // 花心
        fill(255, 215, 0);
        circle(0, 0, 50);
        pop();
    }

    // 检查与其他花朵的碰撞
    checkCollision(other) {
        let d = dist(this.x, this.y, other.x, other.y);
        let minDist = (this.size + other.size) * 40; // 碰撞距离

        if (d < minDist && !this.hasCollided && !other.hasCollided) {
            // 碰撞响应
            let angle = atan2(other.y - this.y, other.x - this.x);
            
            // 交换速度
            let tempVx = this.vx;
            let tempVy = this.vy;
            this.vx = other.vx;
            this.vy = other.vy;
            other.vx = tempVx;
            other.vy = tempVy;

            // 改变两个花的颜色
            this.petalColor = this.getRandomColor();
            other.petalColor = this.getRandomColor();

            // 标记已发生碰撞
            this.hasCollided = true;
            other.hasCollided = true;
        }
    }
}

function setup() {
    createCanvas(800, 800);
}

function draw() {
    background(240);

    // 更新和绘制所有花朵
    for (let i = 0; i < flowers.length; i++) {
        flowers[i].update();
        flowers[i].draw();

        // 检查与其他花朵的碰撞
        for (let j = i + 1; j < flowers.length; j++) {
            flowers[i].checkCollision(flowers[j]);
        }
    }

    // 绘制跟随鼠标的预览花朵
    drawPreviewFlower(mouseX, mouseY);
}

// 绘制预览花朵
function drawPreviewFlower(x, y) {
    push();
    translate(x, y);
    scale(0.5);  // 预览花朵稍小
    noStroke();
    
    // 半透明预览
    fill(255, 192, 203, 150);
    for (let i = 0; i < 8; i++) {
        push();
        rotate(TWO_PI * i / 8);
        ellipse(0, -30, 50, 80);
        pop();
    }
    
    fill(255, 215, 0, 150);
    circle(0, 0, 50);
    pop();
}

// 点击时创建新花朵
function mousePressed() {
    flowers.push(new Flower(mouseX, mouseY));
}
