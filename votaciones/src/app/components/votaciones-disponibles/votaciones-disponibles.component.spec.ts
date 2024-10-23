import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacionesDisponiblesComponent } from './votaciones-disponibles.component';

describe('VotacionesDisponiblesComponent', () => {
  let component: VotacionesDisponiblesComponent;
  let fixture: ComponentFixture<VotacionesDisponiblesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VotacionesDisponiblesComponent]
    });
    fixture = TestBed.createComponent(VotacionesDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
