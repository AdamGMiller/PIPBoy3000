import { Component, OnDestroy, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { IonRange } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameSettings } from '../../models/game-settings.model';
import { GameSettingsService } from '../../game-settings/game-settings.service';
import { Howl } from 'howler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  encapsulation: ViewEncapsulation.None
})
export class GamePage implements OnDestroy {

  @Output() close = new EventEmitter();
  public gameSettings: GameSettings;
  private gameSettings$: Observable<GameSettings>;
  private onDestroy$ = new Subject();

  constructor(
    private gameSettingsService: GameSettingsService
  ) {
    this.gameSettings$ = gameSettingsService.gameSettings;
    this.gameSettings$
      .pipe(
        takeUntil(this.onDestroy$)
      ).
      subscribe(settings => this.gameSettings = settings);
  }

  updateWidth(range: IonRange) {

    const settings = this.gameSettingsService.currentGameSettings;
    const width = +range.value / 100;
    settings.width = width;

    this.gameSettingsService.setGameSettings(settings);
    const soundFile = './assets/audio/ui_menu_ok.wav';

    const sound = new Howl({
      src: [soundFile],
      volume: 1
    });

    sound.play();
  }

  updateWeatherLocation($event) {
    const settings = this.gameSettingsService.currentGameSettings;
    settings.weatherLocation = $event.value;

    this.gameSettingsService.setGameSettings(settings);
    const soundFile = './assets/audio/ui_menu_ok.wav';

    const sound = new Howl({
      src: [soundFile],
      volume: 1
    });

    sound.play();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  return() {
    this.close.emit();
  }

  exit() {
    navigator['app'].exit();
  }
}


