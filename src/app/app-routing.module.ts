import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadExcelComponent } from 'src/components/load-excel.component';


const routes: Routes = [
  { path: '', component: LoadExcelComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
