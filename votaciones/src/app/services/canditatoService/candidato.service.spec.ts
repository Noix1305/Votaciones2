import { TestBed } from '@angular/core/testing';
import { CandidatoService } from './candidato.service';


describe('CanditatoService', () => {
  let service: CandidatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
