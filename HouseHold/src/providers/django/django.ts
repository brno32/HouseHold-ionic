import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DjangoProvider {
  constructor(private http: HttpClient) { }

  readonly BASE_URL = 'http://127.0.0.1:8000/'
  readonly AUTH_URL = this.BASE_URL + 'auth/'
  readonly GROUP_URL = this.BASE_URL + 'groups/'

  readonly API_URL = this.BASE_URL + 'items/'

  readonly LOGIN_URL = this.AUTH_URL + 'token/login/'
  readonly LOGOUT_URL = this.AUTH_URL + 'token/logout/'

  readonly CREATE_USER_URL = this.AUTH_URL + 'users/'
  readonly CREATE_JWT_URL = this.BASE_URL + 'jwt/create/'

  getItemsService(token) {
    // if (token == null) { return }

    const headers = new HttpHeaders()
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', 'JWT ' + token.token)
    console.log(this.API_URL)
    console.log({headers: headers})
    return this.http.get(this.API_URL, {headers: headers})
  }

  getItemService(item_id) {
    return this.http.get(this.API_URL + item_id + '/')
  }

  addItemService(item) {
    return this.http.post(this.API_URL, item)
  }

  updateItemService(item) {
    return this.http.put(this.API_URL + item.id + '/', item)
  }

  deleteItemService(item) {
    return this.http.delete(this.API_URL + item.id + '/', item)
  }

  // Authentication
  registerService(user) {
    return this.http.post(this.CREATE_USER_URL, user)
  }

  loginService(user) {
    return this.http.post(this.LOGIN_URL, user)
  }

  logoutService(user) {
    return this.http.post(this.LOGOUT_URL, user)
  }

  createGroupService(group) {
    return this.http.post(this.GROUP_URL, group)
  }
}
