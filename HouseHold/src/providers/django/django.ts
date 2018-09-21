import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DjangoProvider {
  constructor(private http: HttpClient) { }

  readonly BASE_URL = 'http://127.0.0.1:8000/'
  readonly AUTH_URL = this.BASE_URL + 'auth/'

  readonly API_URL = this.BASE_URL + 'items/'
  readonly GROUP_URL = this.API_URL + 'groups/'

  readonly LOGIN_URL = this.AUTH_URL + 'token/login/'
  readonly LOGOUT_URL = this.AUTH_URL + 'token/logout/'

  readonly CREATE_USER_URL = this.AUTH_URL + 'users/'

  getItemsService(token) {
    if (token == null) { return }
    return this.http.get(this.API_URL, this.makeHeader(token))
  }

  getItemService(item_id, token) {
    return this.http.get(this.API_URL + item_id + '/', this.makeHeader(token))
  }

  addItemService(item) {
    return this.http.post(this.API_URL, item, this.makeHeader(token))
  }

  updateItemService(item, token) {
    return this.http.put(this.API_URL + item.id + '/', item, this.makeHeader(token))
  }

  deleteItemService(item) {
    return this.http.delete(this.API_URL + item.id + '/', item, this.makeHeader(token))
  }

  // Authentication
  makeHeader(token) {
    let headers = new HttpHeaders()
    headers = headers.append('Accept', 'application/json')
    headers = headers.append('Content-Type', 'application/json')
    headers = headers.append('Authorization', 'Token ' + token.auth_token)
    return {headers: headers}
  }

  registerService(user) {
    return this.http.post(this.CREATE_USER_URL, user)
  }

  loginService(user) {
    return this.http.post(this.LOGIN_URL, user)
  }

  logoutService(user) {
    return this.http.post(this.LOGOUT_URL, user)
  }

  createGroupService(group, token) {
    return this.http.post(this.GROUP_URL, group, this.makeHeader(token))
  }

  findGroupService(group, token) {
    return this.http.post(this.GROUP_URL, group, this.makeHeader(token))
  }
}
