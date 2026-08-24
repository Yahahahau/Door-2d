ca// ค่าปรับแต่งตัวละคร (อยากปรับขนาด/ความเร็ว แก้ตรงนี้!)
var PLAYER_SCALE = 0.3;    // ขนาดตัวละคร (0.3 = 30% ของรูปเดิม)
var PLAYER_SPEED = 220;    // ความเร็วเดิน (พิกเซล/วินาที)

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'Noob');
        this.setScale(PLAYER_SCALE);
        this.setOrigin(0.5, 1);          // ให้ "เท้า" อยู่ที่จุด y
        this.setDepth(3);                // อยู่เหนือประตู/พื้น
        this.speed = PLAYER_SPEED;
        this.vx = 0;
        this.facing = 1;                 // 1 = หันขวา, -1 = หันซ้าย
        scene.add.existing(this);
        this.play('idle');
    }

    setMove(dir) {
        this.vx = dir * this.speed;
        if (dir !== 0) this.facing = dir;
    }

    update(deltaSec) {
        this.x += this.vx * deltaSec;
        this.x = Phaser.Math.Clamp(this.x, 50, 750);

        if (this.vx !== 0) {
            this.setFlipX(this.facing < 0);
            this.play('walk', true);     // true = ไม่รีสตาร์ทถ้ากำลังเล่นอยู่
        } else {
            this.play('idle', true);
        }
    }

    resetPosition(x) {
        this.x = x;
        this.setMove(0);
    }
}