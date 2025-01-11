import { Component, inject } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FirebaseAuthService } from "../firebase-auth.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton]
})
export class HomePage {

  private readonly firebaseAuthService = inject(FirebaseAuthService);

  get userSignal() {
    return this.firebaseAuthService.userSignal;
  }

  async signInAnonymously() {
    await this.firebaseAuthService.signInAnonymously();
    console.log('Anonymous sign in complete');
  }

  async signOut() {
    await this.firebaseAuthService.signOut();
    console.log('Sign out complete');
  }
}
