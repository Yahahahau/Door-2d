class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // ข้อความตอนโหลด
        this.add.text(400, 210, 'กำลังโหลด DOORS 2D...', {
            fontFamily: 'sans-serif',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // โหลด sprite ผู้เล่น + ข้อมูลห้อง
        this.load.atlas('Noob', 'assets/sprites/Noob.png', 'assets/sprites/Noob.json');
        this.load.json('rooms', 'assets/data/rooms.json');
    }

    create() {
        this.createAnimations();
        this.scene.start('GameScene');
        this.scene.launch('UIScene');
    }

    createAnimations() {
        // สร้างตารางชื่อเฟรม (กันเรื่องช่องว่างต่อท้ายชื่อ — ตัดออกก่อนเทียบ)
        var tex = this.textures.get('Noob');
        var lookup = {};
        Object.keys(tex.frames).forEach(function (key) {
            lookup[key.trim()] = key;
        });

        function pick(names) {
            return names.map(function (n) {
                return { key: 'Noob', frame: (lookup[n] !== undefined) ? lookup[n] : n };
            });
        }

        // ยืนหายใจ (8 เฟรม)
        this.anims.create({
            key: 'idle',
            frames: pick(['idle', 'idle-2', 'idle-3', 'idle-4', 'idle-5', 'idle-6', 'idle-7', 'idle-8']),
            frameRate: 12,
            repeat: -1
        });

        // เดิน (12 เฟรม)
        this.anims.create({
            key: 'walk',
            frames: pick(['Walk', 'Walk-2', 'Walk-3', 'Walk-4', 'Walk-5', 'Walk-6',
                          'Walk-7', 'Walk-8', 'Walk-9', 'Walk-10', 'Walk-11', 'Walk-12']),
            frameRate: 12,
            repeat: -1
        });

        // วิ่ง (6 เฟรม) — เก็บไว้เฟส 2
        this.anims.create({
            key: 'run',
            frames: pick(['Run', 'Run-2', 'Run-3', 'Run-4', 'Run-5', 'Run-6']),
            frameRate: 12,
            repeat: -1
        });

        // ย่อแอบ (8 เฟรม) — เก็บไว้เฟส 2
        this.anims.create({
            key: 'crouch-idle',
            frames: pick(['Crouch-idle', 'Crouch-idle-2', 'Crouch-idle-3', 'Crouch-idle-4',
                          'Crouch-idle-5', 'Crouch-idle-6', 'Crouch-idle-7', 'Crouch-idle-8']),
            frameRate: 12,
            repeat: -1
        });

        // ย่อเดิน (12 เฟรม) — เก็บไว้เฟส 2
        this.anims.create({
            key: 'crouch-walk',
            frames: pick(['Crouch-walk', 'Crouch-walk-2', 'Crouch-walk-3', 'Crouch-walk-4',
                          'Crouch-walk-5', 'Crouch-walk-6', 'Crouch-walk-7', 'Crouch-walk-8',
                          'Crouch-walk-9', 'Crouch-walk-10', 'Crouch-walk-11', 'Crouch-walk-12']),
            frameRate: 12,
            repeat: -1
        });
    }
}