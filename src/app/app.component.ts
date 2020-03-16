import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadedFeature: string = 'recipes-link';

  onNavigate(linkName: string) {
    this.loadedFeature = linkName;
  }

  isActive(linkName: string): boolean {
    return linkName === this.loadedFeature;
  }
}
