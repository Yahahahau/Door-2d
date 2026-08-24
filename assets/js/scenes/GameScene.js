// แปลงสี "#2a1f1f" → ตัวเลขที่ Phaser เข้าใจ
function hexNum(hex) {
    return parseInt(hex.slice(1), 16);
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // ข้อมูลห้อง
        this.themes = this.cache.json.get('rooms').themes;
        this.roomNumber = 1;
        this.theme = this.themes[0];

        // ค่าคงที่ฉาก
        this.groundY = 380;
        this.doorX = 700;

        // สถานะ
        this.touchDir = 0;
        this.nearDoor = false;
        this.transitioning = false;

        // ----- วาดฉาก -----
        this.bgRect = this.add.rectangle(400, 225, 800, 450, hexNum(this.theme.bg));
        this.wallRect = this.add.rectangle(400, 12, 800, 24, hexNum(this.theme.wall));
        this.floorRect = this.add.rectangle(400, 415, 800, 70, hexNum(this.theme.floor));
        this.floorLine = this.add.rectangle(400, this.groundY, 800, 4, 0x000000, 0.6);

        // ----- ประตู -----
        this.doorGfx = this.add.graphics();
        this.doorGfx.setDepth(1);
        this.drawDoor();

        // ----- ผู้เล่น -----
        this.player = new Player(this, 120, this.groundY);

        // ----- ปุ่มจาก UIScene -----
        this.game.events.on('input:move', function (dir) {
            this.touchDir = dir;
        }, this);
        this.game.events.on('input:action', function () {
            this.tryOpenDoor();
        }, this);

        // ----- คีย์บอร์ด (เทสบนคอม) -----
        this.keys = this.input.keyboard.addKeys('A,D,LEFT,RIGHT,SPACE,ENTER');
    }

    drawDoor() {
        var g = this.doorGfx;
        g.clear();
        g.fillStyle(hexNum(this.theme.door), 1);
        g.fillRect(this.doorX - 35, this.groundY - 150, 70, 150);
        g.lineStyle(4, 0x000000, 0.6);
        g.strokeRect(this.doorX - 35, this.groundY - 150, 70, 150);
        g.fillStyle(0xffd700, 1);
        g.fillCircle(this.doorX + 22, this.groundY - 75, 5);
    }

    applyTheme() {
        this.bgRect.setFillStyle(hexNum(this.theme.bg));
        this.wallRect.setFillStyle(hexNum(this.theme.wall));
        this.floorRect.setFillStyle(hexNum(this.theme.floor));
        this.drawDoor();
    }

    tryOpenDoor() {
        if (this.transitioning || !this.nearDoor) return;
        this.transitioning = true;

        this.cameras.main.fadeOut(400);
        this.cameras.main.once('camerafadeoutcomplete', function () {
            this.roomNumber++;
            this.theme = this.themes[(this.roomNumber - 1) % this.themes.length];
            this.applyTheme();
            this.player.resetPosition(120);
            this.touchDir = 0;
            this.game.events.emit('room:changed', this.roomNumber, this.theme.name);
            this.cameras.main.fadeIn(400);
            this.transitioning = false;
        }, this);
    }

    update(time, delta) {
        // รวมคีย์บอร์ด + ปุ่มสัมผัส
        var dir = 0;
        if (!this.transitioning) {
            if (this.keys.LEFT.isDown || this.keys.A.isDown) dir = -1;
            else if (this.keys.RIGHT.isDown || this.keys.D.isDown) dir = 1;
            else dir = this.touchDir;

            // กด Space / Enter เพื่อเปิดประตู
            if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE) ||
                Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) {
                this.tryOpenDoor();
            }
        }

        this.player.setMove(dir);
        this.player.update(delta / 1000);

        // ตรวจระยะใกล้ประตู
        var near = Math.abs(this.player.x - this.doorX) < 70;
        if (near !== this.nearDoor) {
            this.nearDoor = near;
            this.game.events.emit('door:near', near);
        }
    }
}