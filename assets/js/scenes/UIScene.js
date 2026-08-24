class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        var rooms = this.cache.json.get('rooms');
        var firstTheme = rooms.themes[0];

        // ----- HUD มุมซ้ายบน -----
        this.roomText = this.add.text(16, 10, 'ห้องที่ 1', {
            fontFamily: 'sans-serif', fontSize: '20px', fill: '#ffd700', fontStyle: 'bold'
        });
        this.nameText = this.add.text(16, 34, firstTheme.name, {
            fontFamily: 'sans-serif', fontSize: '16px', fill: '#ffffff'
        });
        this.hpText = this.add.text(16, 56, 'HP: 100', {
            fontFamily: 'sans-serif', fontSize: '16px', fill: '#ff4444'
        });

        // ----- ข้อความเตือนหน้าประตู -----
        this.prompt = this.add.text(400, 150, 'กด ✋ เพื่อเปิดประตู', {
            fontFamily: 'sans-serif', fontSize: '22px', fill: '#ffffff',
            backgroundColor: '#000000', padding: { x: 16, y: 10 }
        }).setOrigin(0.5).setVisible(false);

        // ----- ปุ่มควบคุม -----
        this.makeMoveButton(70, 385, '◀', -1);
        this.makeMoveButton(150, 385, '▶', 1);
        this.makeActionButton(730, 385, '✋');

        // ถ้าปล่อยนิ้วนอกปุ่ม → หยุดเดิน (กันค้าง)
        this.input.on('pointerup', function () {
            this.game.events.emit('input:move', 0);
        }, this);

        // ----- รับเหตุการณ์จาก GameScene -----
        this.game.events.on('door:near', function (near) {
            this.prompt.setVisible(near);
        }, this);
        this.game.events.on('room:changed', function (num, name) {
            this.roomText.setText('ห้องที่ ' + num);
            this.nameText.setText(name);
        }, this);
    }

    makeMoveButton(x, y, label, dir) {
        var self = this;
        var bg = this.add.rectangle(x, y, 64, 64, 0xffffff, 0.2)
            .setStrokeStyle(3, 0xffffff, 0.6);
        bg.setInteractive();
        this.add.text(x, y, label, {
            fontFamily: 'sans-serif', fontSize: '26px', fill: '#ffffff'
        }).setOrigin(0.5);

        bg.on('pointerdown', function () { self.game.events.emit('input:move', dir); });
        bg.on('pointerup', function () { self.game.events.emit('input:move', 0); });
        bg.on('pointerout', function () { self.game.events.emit('input:move', 0); });
    }

    makeActionButton(x, y, label) {
        var self = this;
        var bg = this.add.rectangle(x, y, 64, 64, 0xffd700, 0.25)
            .setStrokeStyle(3, 0xffd700, 0.8);
        bg.setInteractive();
        this.add.text(x, y, label, {
            fontFamily: 'sans-serif', fontSize: '26px', fill: '#ffffff'
        }).setOrigin(0.5);

        bg.on('pointerdown', function () { self.game.events.emit('input:action'); });
    }
}