import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitUpdateComponent } from './update';

describe('LimitUpdateComponent', () => {
  let component: LimitUpdateComponent;
  let fixture: ComponentFixture<LimitUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitUpdateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
