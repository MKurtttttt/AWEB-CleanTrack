import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('CleanTrack');
  
  private cursorFollower: HTMLElement | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private cursorX = 0;
  private cursorY = 0;
  private animationId: number | null = null;

  ngOnInit() {
    this.initCustomCursor();
  }

  ngOnDestroy() {
    this.destroyCustomCursor();
  }

  private initCustomCursor() {
    // Create cursor glow element only
    this.cursorFollower = document.createElement('div');
    this.cursorFollower.className = 'cursor-follower';

    // Add to body
    document.body.appendChild(this.cursorFollower);

    // Mouse move listener
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // Hover effects
    document.addEventListener('mouseover', (e) => this.handleMouseOver(e));
    document.addEventListener('mouseout', (e) => this.handleMouseOut(e));
    
    // Click effects
    document.addEventListener('mousedown', () => this.handleClick());
    document.addEventListener('mouseup', () => this.handleClickRelease());

    // Start animation loop
    this.animateCursor();
  }

  private handleMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  private handleMouseOver(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.matches('button, a, input, textarea, select, .btn-primary, .btn-secondary, .menu-item, .nav-item, .stat-card, .step, .feature, .nav-logo')) {
      this.cursorFollower?.classList.add('hover');
    }
  }

  private handleMouseOut(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.matches('button, a, input, textarea, select, .btn-primary, .btn-secondary, .menu-item, .nav-item, .stat-card, .step, .feature, .nav-logo')) {
      this.cursorFollower?.classList.remove('hover');
    }
  }

  private handleClick() {
    this.cursorFollower?.classList.add('click');
  }

  private handleClickRelease() {
    this.cursorFollower?.classList.remove('click');
  }

  private animateCursor() {
    const animate = () => {
      // Smooth following with easing
      const dx = this.mouseX - this.cursorX;
      const dy = this.mouseY - this.cursorY;
      
      this.cursorX += dx * 0.15; // Easing factor
      this.cursorY += dy * 0.15;

      // Update position
      if (this.cursorFollower) {
        this.cursorFollower.style.left = `${this.cursorX}px`;
        this.cursorFollower.style.top = `${this.cursorY}px`;
      }

      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  private destroyCustomCursor() {
    // Remove event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseover', this.handleMouseOver);
    document.removeEventListener('mouseout', this.handleMouseOut);
    document.removeEventListener('mousedown', this.handleClick);
    document.removeEventListener('mouseup', this.handleClickRelease);

    // Cancel animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Remove element
    this.cursorFollower?.remove();
  }
}
