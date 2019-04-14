import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';
import { GameSettings } from '../models/game-settings.model';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class GameSettingsService {
  private _gameSettings: BehaviorSubject<GameSettings>;

  constructor(private storage: Storage) {
    const gameSettings: GameSettings = {
      width: 1,
      weatherLocation: '',
      newsApiKey: null,
      weatherApiKey: null
    };

    this._gameSettings = new BehaviorSubject<GameSettings>(gameSettings);
    this._gameSettings.next(gameSettings);

    this.loadFromStorage();
  }

  get gameSettings() {
    return this._gameSettings.asObservable();
  }

  get currentGameSettings() {
    return this._gameSettings.value;
  }

  setGameSettings(gameSettings: GameSettings) {
    this.saveToStorage(gameSettings);
    this._gameSettings.next(gameSettings);
  }

  setNumericItem(item: string, value: number) {
    // store the new value
    this.storage.set(item, value);

    // update and emit new value
    const settings = _.clone(this.currentGameSettings);
    settings[item].value = value;
    this._gameSettings.next(settings);

    this.saveToStorage(settings);
  }

  private loadFromStorage() {
    this.storage.get('gameSettings').then((settings: GameSettings) => {
      if (settings !== null) {
        this._gameSettings.next(settings);
      }
    });
  }

  private saveToStorage(gameSettings: GameSettings) {
    this.storage.set('gameSettings', gameSettings);
  }
}
