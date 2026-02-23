import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitDeleteComponent } from './delete';

describe('LimitDeleteComponent', () => {
  let component: LimitDeleteComponent;
  let fixture: ComponentFixture<LimitDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitDeleteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
