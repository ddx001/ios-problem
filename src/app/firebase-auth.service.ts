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
    try {
      console.debug('***** Calling getAuth(initializeApp(...))');

      this.auth =
        getAuth(
          initializeApp(environment.firebaseOptions));

      console.debug('***** getAuth(initializeApp(...)) call complete');

    } catch (error) {
      console.error('***** getAuth(initializeApp(...)) call failed', error);
      throw error;
    }

    try {
      console.debug('***** Calling onAuthStateChanged()');

      onAuthStateChanged(this.auth,
        user => {
          console.debug('***** onAuthStateChanged() callback', user);
          this.userSignal.set(user || undefined);
        },
        error => {
          console.error('***** onAuthStateChanged() error callback', error);
        },
        () => {
          console.debug('***** onAuthStateChanged() complete callback');
        });

      console.debug('***** onAuthStateChanged() call complete');

    } catch (error) {
      console.error('***** onAuthStateChanged() call failed', error);
      throw error;
    }
  }

  async signInAnonymously() {
    try {
      console.debug('***** Calling signInAnonymously()');

      await signInAnonymously(this.auth);

      console.debug('***** signInAnonymously() call complete');

    } catch (error) {
      console.error('***** signInAnonymously() call failed', error);
    }
  }

  async signOut() {
    try {
      console.debug('***** Calling signOut()');

      await signOut(this.auth);

      console.debug('***** signOut() call complete');

    } catch (error) {
      console.error('***** signOut() call failed', error);
    }
  }
}
