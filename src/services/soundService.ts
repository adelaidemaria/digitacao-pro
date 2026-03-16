class SoundService {
  private static instance: SoundService;
  private correctSound: HTMLAudioElement;
  private errorSound: HTMLAudioElement;
  private successSound: HTMLAudioElement;

  private constructor() {
    // Using standard beep sounds or public assets
    this.correctSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    this.errorSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3');
    this.successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    
    [this.correctSound, this.errorSound, this.successSound].forEach(s => {
      s.volume = 0.3;
      s.preload = 'auto';
    });
  }

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  playCorrect() {
    this.correctSound.currentTime = 0;
    this.correctSound.play().catch(() => {});
  }

  playError() {
    this.errorSound.currentTime = 0;
    this.errorSound.play().catch(() => {});
  }

  playSuccess() {
    this.successSound.currentTime = 0;
    this.successSound.play().catch(() => {});
  }
}

export const sounds = SoundService.getInstance();
