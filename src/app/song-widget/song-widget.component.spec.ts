import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongWidgetComponent } from './song-widget.component';

describe('SongWidgetComponent', () => {
  let component: SongWidgetComponent;
  let fixture: ComponentFixture<SongWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SongWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SongWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
