import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerResultadosComponent } from './ver-resultados.component';

describe('VerResultadosComponent', () => {
  let component: VerResultadosComponent;
  let fixture: ComponentFixture<VerResultadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerResultadosComponent]
    });
    fixture = TestBed.createComponent(VerResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
