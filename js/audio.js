// MetroSim - Audio Manager
// Handles background music and sound effects

class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = null;
        this.masterVolume = 0.5;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.7;
        this.isMuted = false;
        
        this.initializeSounds();
    }

    initializeSounds() {
        // Background music
        this.music = new Howl({
            src: ['https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'],
            loop: true,
            volume: this.musicVolume * this.masterVolume
        });

        // Sound effects
        const soundEffects = {
            'click': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            'build': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            'demolish': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            'notification': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            'disaster': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
        };

        for (const [name, src] of Object.entries(soundEffects)) {
            this.sounds.set(name, new Howl({
                src: [src],
                volume: this.sfxVolume * this.masterVolume
            }));
        }
    }

    playSound(name) {
        if (this.isMuted) return;
        
        const sound = this.sounds.get(name);
        if (sound) {
            sound.play();
        }
    }

    playMusic() {
        if (!this.isMuted && this.music) {
            this.music.play();
        }
    }

    stopMusic() {
        if (this.music) {
            this.music.stop();
        }
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.music) {
            this.music.volume(this.musicVolume * this.masterVolume);
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(sound => {
            sound.volume(this.sfxVolume * this.masterVolume);
        });
    }

    updateAllVolumes() {
        if (this.music) {
            this.music.volume(this.musicVolume * this.masterVolume);
        }
        
        this.sounds.forEach(sound => {
            sound.volume(this.sfxVolume * this.masterVolume);
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopMusic();
        } else {
            this.playMusic();
        }
        
        return this.isMuted;
    }
}

// Export for use in other modules
window.AudioManager = AudioManager;
