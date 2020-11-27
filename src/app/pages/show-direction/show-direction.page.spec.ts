import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowDirectionPage } from './show-direction.page';

describe('ShowDirectionPage', () => {
  let component: ShowDirectionPage;
  let fixture: ComponentFixture<ShowDirectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDirectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowDirectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
