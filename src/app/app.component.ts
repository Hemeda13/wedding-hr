import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wedding-mm';
  isPlaying = false;
  showAutoplayPrompt = false;
  private audio: HTMLAudioElement | null = null;
  private hasUserInteracted = false;

  constructor() {
    // Initialize audio when component loads
    this.initializeAudio();
  }

  ngOnInit() {
    // Try to start music automatically after a short delay
    setTimeout(() => {
      this.startAutoPlay();
    }, 2000);
  }

  // Listen for any user interaction to enable autoplay
  @HostListener('document:click', [])
  @HostListener('document:touchstart', [])
  @HostListener('document:keydown', [])
  onUserInteraction() {
    if (!this.hasUserInteracted && !this.isPlaying) {
      this.hasUserInteracted = true;
      // Try to start music silently on first user interaction
      this.startAutoPlay();
    }
  }

  initializeAudio() {
    // Create audio element for wedding music
    this.audio = new Audio();
    this.audio.src = 'assets/wedding-music.mp3';
    this.audio.loop = true;
    this.audio.volume = 0.3; // Set to 30% volume
    this.audio.preload = 'auto';

    // Add event listeners
    this.audio.addEventListener('canplaythrough', () => {
      console.log('Audio is ready to play');
      if (!this.isPlaying) {
        this.startAutoPlay();
      }
    });
  }

  startAutoPlay() {
    if (!this.audio) return;

    console.log('Attempting to start music automatically...');
    const playPromise = this.audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
        this.showAutoplayPrompt = false;
        console.log('Music started automatically');
      }).catch(error => {
        console.log('Autoplay failed silently, waiting for user interaction:', error);
        // Don't show prompt immediately, just fail silently
        this.isPlaying = false;
        this.showAutoplayPrompt = false;
      });
    }
  }

  enableMusic() {
    this.showAutoplayPrompt = false;
    this.hasUserInteracted = true;
    this.startAutoPlay();
  }

  toggleMusic() {
    if (!this.audio) return;

    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
      console.log('Music paused');
    } else {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          console.log('Music started');
        }).catch(error => {
          console.log('Audio playback failed:', error);
          // Show user that manual interaction is needed
          this.showAutoplayPrompt = true;
        });
      }
    }
  }

  openDirections() {
    // Function to open Google Maps directions to Grand Hall Sohag
    const destination = 'Grand Hall Sohag';
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
  }
}
