$(document).ready( function () {
    soundManager.onready( function() {
        initSounds = function() {
            if (!soundManager.supported()) {
                return false;
            }

            soundManager.createSound({
                id: 'bomb',
                url: (window.XLSF_URL_BASE || '') + 'assets/sounds/bomb.mp3',
                autoLoad: true,
                multiShot: true,
                volume: 100
            });

            soundManager.createSound({
                id: 'death',
                url: (window.XLSF_URL_BASE || '') + 'assets/sounds/death.mp3',
                autoLoad: true,
                multiShot: true,
                volume: 100
            });

            soundManager.createSound({
                id: 'allocate_bomb',
                url: (window.XLSF_URL_BASE || '') + 'assets/sounds/takedown.mp3',
                autoLoad: true,
                multiShot: true,
                volume: 100
            });

        };

        initSounds();
    });
});

