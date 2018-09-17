import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DjangoProvider {
  constructor(private http: HttpClient) { }

  readonly BASE_URL = 'http://127.0.0.1:8000/'
  readonly AUTH_URL = this.BASE_URL + 'auth/'

  api_url = this.BASE_URL + 'items/'

  login_url = this.AUTH_URL + 'token/login/'
  logout_url = this.AUTH_URL + 'token/logout/'

  create_user_url = this.AUTH_URL + 'users/'
  create_jwt_url = this.BASE_URL + 'jwt/create/'

  getItemsService(token) {
    if (token == null) {
      return this.http.get(this.api_url)
    }

    const headers = new HttpHeaders()
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', 'JWT ' + token.token)
    return this.http.get(this.api_url, {headers: headers})
  }

  getItemService(item_id) {
    return this.http.get(this.api_url + item_id + '/')
  }

  addItemService(item) {
    return this.http.post(this.api_url, item)
  }

  updateItemService(item) {
    return this.http.put(this.api_url + item.id + '/', item)
  }

  deleteItemService(item) {
    return this.http.delete(this.api_url + item.id + '/', item)
  }

  // Authentication
  loginService(user) {
    return this.http.post(this.login_url, user)
  }

  registerService(user) {
    return this.http.post(this.create_user_url, user)
  }

  logoutService(user) {
    return this.http.post(this.logout_url, user)
  }
}
