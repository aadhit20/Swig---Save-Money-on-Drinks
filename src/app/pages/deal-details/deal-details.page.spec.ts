import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DealDetailsPage } from './deal-details.page';

describe('DealDetailsPage', () => {
  let component: DealDetailsPage;
  let fixture: ComponentFixture<DealDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DealDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
