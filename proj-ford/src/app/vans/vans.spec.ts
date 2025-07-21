import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vans } from './vans';

describe('Vans', () => {
  let component: Vans;
  let fixture: ComponentFixture<Vans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
