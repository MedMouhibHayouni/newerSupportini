import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) { }
  successToast (message:string,title:string){
    this.toastr.success(message, title);
  }
  errorToast(message:string,title:string){
    this.toastr.error(message,title)
  }

  async showConfirmDialog(title: string, message: string, confirmText: string, cancelText: string, icon: string): Promise<boolean> {
  return new Promise((resolve) => {
    // You'd implement this using your preferred modal/dialog solution
    // (e.g., SweetAlert, custom modal, etc.)
    // This is just a placeholder implementation
    const result = confirm(`${title}\n${message}`);
    resolve(result);
  });
}
}
