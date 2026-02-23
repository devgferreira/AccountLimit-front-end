import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitSearchComponent } from './search';

describe('LimitSearchComponent', () => {
  let component: LimitSearchComponent;
  let fixture: ComponentFixture<LimitSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitSearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
