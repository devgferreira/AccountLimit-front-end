import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixAuthorizeComponent } from './authorize';

describe('PixAuthorizeComponent', () => {
  let component: PixAuthorizeComponent;
  let fixture: ComponentFixture<PixAuthorizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixAuthorizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixAuthorizeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
