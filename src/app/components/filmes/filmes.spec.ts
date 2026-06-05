import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filmes } from './filmes';

describe('Filmes', () => {
  let component: Filmes;
  let fixture: ComponentFixture<Filmes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filmes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Filmes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
