import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Suvs } from './suvs';

describe('Suvs', () => {
  let component: Suvs;
  let fixture: ComponentFixture<Suvs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Suvs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Suvs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
