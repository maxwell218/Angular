import { Component } from '@angular/core';
import { Ronde } from './classes/Ronde';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'poker';
  ronde:Ronde = new Ronde();

  demarrer() {
    this.ronde.distribuerCartes();
  }
}
