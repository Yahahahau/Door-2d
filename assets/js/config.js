var config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 450,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,          // บังคับ 16:9 อัตโนมัติ!
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, GameScene, UIScene]
};

var game = new Phaser.Game(config);