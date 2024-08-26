import { Injectable, signal } from '@angular/core';
import { User } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { environment } from "../environments/environment";

@Injectable({providedIn: 'root'})
export class FirebaseAuthService {

  private readonly auth: Auth;

  userSignal = signal<User | undefined>(undefined);

  constructor() {
    this.auth =
      getAuth(
        initializeApp(environment.firebaseOptions));

    onAuthStateChanged(this.auth, user => {
      this.userSignal.set(user || undefined);
    });
  }

  async signInAnonymously() {
    await signInAnonymously(this.auth);
  }

  async signOut() {
    await signOut(this.auth);
  }
}
