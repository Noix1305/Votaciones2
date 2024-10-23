import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCandidatoComponent } from './ver-candidato.component';

describe('VerCandidatoComponent', () => {
  let component: VerCandidatoComponent;
  let fixture: ComponentFixture<VerCandidatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerCandidatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerCandidatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
