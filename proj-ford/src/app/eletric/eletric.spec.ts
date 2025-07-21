import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eletric } from './eletric';

describe('Eletric', () => {
  let component: Eletric;
  let fixture: ComponentFixture<Eletric>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eletric]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Eletric);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
