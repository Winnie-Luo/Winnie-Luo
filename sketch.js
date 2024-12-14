// 定义全局变量
let flowers = [];
let flowerSize = 1;
  
class Flower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(0.5, 1.5);
        this.petalCount = floor(random(6, 12));
        this.petalLength = random(60, 100);
        this.petalWidth = random(40, 70);
        this.petalColor = this.getRandomColor();
        this.centerSize = random(40, 60);
        this.vx = random(-4, 4);  // 增加初始速度
        this.vy = random(-4, 4);
        this.hasCollided = false;
        this.friction = 0.995;    // 减小摩擦力
        this.flowerStyle = floor(random(4));
        this.centerStyle = floor(random(3));
    }

    getRandomColor() {
        const colors = [
            color(255, 182, 193), // 浅粉红
            color(255, 140, 0),   // 深橙色
            color(255, 215, 0),   // 金色
            color(147, 112, 219), // 紫色
            color(60, 179, 113),  // 中海蓝绿
            color(30, 144, 255),  // 道奇蓝
            color(220, 20, 60),   // 猩红色
            color(218, 112, 214), // 兰花紫
            color(0, 250, 154),   // 春绿
            color(255, 99, 71)    // 番茄色
        ];
        return random(colors);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.friction;
        this.vy *= this.friction;

        // 修改边界处理，让花朵从另一边出现
        if (this.x < -50) {
            this.x = windowWidth + 50;
        } else if (this.x > windowWidth + 50) {
            this.x = -50;
        }
        
        if (this.y < -50) {
            this.y = windowHeight + 50;
        } else if (this.y > windowHeight + 50) {
            this.y = -50;
        }

        this.hasCollided = false;
    }

    draw() {
        push();
        translate(this.x, this.y);
        scale(this.size);

        // 花瓣
        fill(this.petalColor);
        noStroke();
        
        switch(this.flowerStyle) {
            case 0: // 基础花瓣
                for (let i = 0; i < this.petalCount; i++) {
                    push();
                    rotate(TWO_PI * i / this.petalCount);
                    ellipse(0, -this.petalLength/2, this.petalWidth, this.petalLength);
                    pop();
                }
                break;
            
            case 1: // 心形花瓣
                for (let i = 0; i < this.petalCount; i++) {
                    push();
                    rotate(TWO_PI * i / this.petalCount);
                    beginShape();
                    for (let a = 0; a < TWO_PI; a += 0.1) {
                        let r = this.petalLength * (1 + cos(a)) * 0.5;
                        let x = r * cos(a) * 0.5;
                        let y = -r * sin(a) * 0.5;
                        vertex(x, y);
                    }
                    endShape(CLOSE);
                    pop();
                }
                break;
            
            case 2: // 波浪形花瓣
                for (let i = 0; i < this.petalCount; i++) {
                    push();
                    rotate(TWO_PI * i / this.petalCount);
                    beginShape();
                    for (let y = 0; y > -this.petalLength; y -= 2) {
                        let x = sin(y * 0.1) * this.petalWidth/2;
                        vertex(x, y);
                    }
                    for (let y = -this.petalLength; y < 0; y += 2) {
                        let x = -sin(y * 0.1) * this.petalWidth/2;
                        vertex(x, y);
                    }
                    endShape(CLOSE);
                    pop();
                }
                break;
            
            case 3: // 贝塞尔曲线花瓣
                for (let i = 0; i < this.petalCount; i++) {
                    push();
                    rotate(TWO_PI * i / this.petalCount);
                    beginShape();
                    vertex(0, 0);
                    bezierVertex(
                        -this.petalWidth/2, -this.petalLength/3,
                        -this.petalWidth/3, -this.petalLength,
                        0, -this.petalLength
                    );
                    bezierVertex(
                        this.petalWidth/3, -this.petalLength,
                        this.petalWidth/2, -this.petalLength/3,
                        0, 0
                    );
                    endShape(CLOSE);
                    pop();
                }
                break;
        }

        // 花心
        switch(this.centerStyle) {
            case 0: // 普通圆形
                fill(255, 215, 0);
                circle(0, 0, this.centerSize);
                break;
            
            case 1: // 螺旋形
                fill(255, 215, 0);
                beginShape();
                for (let a = 0; a < TWO_PI * 3; a += 0.1) {
                    let r = this.centerSize * (1 - a/(TWO_PI * 3)) * 0.5;
                    let x = r * cos(a);
                    let y = r * sin(a);
                    vertex(x, y);
                }
                endShape(CLOSE);
                break;
            
            case 2: // 多边形
                fill(255, 215, 0);
                beginShape();
                for (let i = 0; i < 6; i++) {
                    let angle = TWO_PI * i / 6;
                    let x = cos(angle) * this.centerSize/2;
                    let y = sin(angle) * this.centerSize/2;
                    vertex(x, y);
                }
                endShape(CLOSE);
                break;
        }

        pop();
    }

    checkCollision(other) {
        let d = dist(this.x, this.y, other.x, other.y);
        let minDist = (this.size + other.size) * 40;

        if (d < minDist && !this.hasCollided && !other.hasCollided) {
            let angle = atan2(other.y - this.y, other.x - this.x);
            let force = map(d, 0, minDist, 8, 2);
            
            this.vx = -cos(angle) * force;
            this.vy = -sin(angle) * force;
            other.vx = cos(angle) * force;
            other.vy = sin(angle) * force;

            this.petalColor = this.getRandomColor();
            other.petalColor = other.getRandomColor();

            this.flowerStyle = floor(random(4));
            this.centerStyle = floor(random(3));
            other.flowerStyle = floor(random(4));
            other.centerStyle = floor(random(3));

            this.petalCount = floor(random(6, 12));
            this.petalLength = random(60, 100);
            this.petalWidth = random(40, 70);
            other.petalCount = floor(random(6, 12));
            other.petalLength = random(60, 100);
            other.petalWidth = random(40, 70);

            this.hasCollided = true;
            other.hasCollided = true;
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    // 根据窗口大小调整花朵数量
    let flowerCount = floor((windowWidth * windowHeight) / 40000);
    for(let i = 0; i < flowerCount; i++) {
        flowers.push(new Flower(
            random(width),
            random(height)
        ));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(240);

    for (let i = 0; i < flowers.length; i++) {
        flowers[i].update();
        flowers[i].draw();

        for (let j = i + 1; j < flowers.length; j++) {
            flowers[i].checkCollision(flowers[j]);
        }
    }

    drawPreviewFlower(mouseX, mouseY);
}

function drawPreviewFlower(x, y) {
    push();
    translate(x, y);
    scale(0.5);
    noStroke();
    
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

function mousePressed() {
    flowers.push(new Flower(mouseX, mouseY));
}

function keyPressed() {
    if (key === 'a' || key === 'A') {
        // 添加一朵花
        flowers.push(new Flower(random(width), random(height)));
    } else if (key === 'r' || key === 'R') {
        // 随机添加多朵花
        for(let i = 0; i < 5; i++) {
            flowers.push(new Flower(random(width), random(height)));
        }
    } else if (key === 'c' || key === 'C') {
        // 清除所有花朵
        flowers = [];
    }
}
