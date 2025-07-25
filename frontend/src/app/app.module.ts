import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';  // Import the routing module

@NgModule({
  declarations: [
    // AppComponent,
    // Add other components here, e.g., HomeComponent, AboutComponent
  ],
  imports: [
    BrowserModule,  
    AppRoutingModule, 
  ],
  providers: [],
//   bootstrap: [AppComponent]  // Bootstrap the main component
})
export class AppModule { }
