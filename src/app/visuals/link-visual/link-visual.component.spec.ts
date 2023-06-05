import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkVisualComponent } from './link-visual.component';

describe('LinkVisualComponent', () => {
  let component: LinkVisualComponent;
  let fixture: ComponentFixture<LinkVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkVisualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
