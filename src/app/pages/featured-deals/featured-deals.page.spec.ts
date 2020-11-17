import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FeaturedDealsPage } from './featured-deals.page';

describe('FeaturedDealsPage', () => {
  let component: FeaturedDealsPage;
  let fixture: ComponentFixture<FeaturedDealsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedDealsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedDealsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
