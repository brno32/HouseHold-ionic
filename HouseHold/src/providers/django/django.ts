import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DjangoProvider {

  token = ""

  constructor(
    public events: Events,
    private http: HttpClient,
    private storage: Storage,
  ) {
    events.subscribe('setToken', (topic, data) => {
      this.setToken()
    })
  }

  readonly BASE_URL = 'http://69.55.55.164/'
  // readonly BASE_URL = 'http://127.0.0.1:8000/'
  readonly AUTH_URL = this.BASE_URL + 'auth/'

  readonly API_URL = this.BASE_URL + 'items/'
  readonly GROUP_URL = this.API_URL + 'groups/'

  readonly LOGIN_URL = this.AUTH_URL + 'token/login/'
  readonly LOGOUT_URL = this.AUTH_URL + 'token/logout/'

  readonly CREATE_USER_URL = this.AUTH_URL + 'users/'

  getItemsService() {
    return this.http.get(this.API_URL, this.makeHeader())
  }

  getItemService(item_id) {
    return this.http.get(this.API_URL + item_id + '/', this.makeHeader())
  }

  addItemService(item) {
    return this.http.post(this.API_URL, item, this.makeHeader())
  }

  updateItemService(item) {
    return this.http.put(this.API_URL + item.id + '/', item, this.makeHeader())
  }

  deleteItemService(item) {
    return this.http.delete(this.API_URL + item.id + '/', this.makeHeader())
  }

  // Authentication
  makeHeader() {
    let headers = new HttpHeaders()
    headers = headers.append('Accept', 'application/json')
    headers = headers.append('Content-Type', 'application/json')
    headers = headers.append('Authorization', 'Token ' + this.token)
    return {headers: headers}
  }

  registerService(user) {
    return this.http.post(this.CREATE_USER_URL, user)
  }

  loginService(user) {
    return this.http.post(this.LOGIN_URL, user)
  }

  logoutService() {
    return this.http.post(this.LOGOUT_URL, {}, this.makeHeader())
  }

  createGroupService(group) {
    return this.http.post(this.GROUP_URL, group, this.makeHeader())
  }

  findGroupService(group) {
    return this.http.put(this.GROUP_URL + group.name + '/', group, this.makeHeader())
  }

  setToken() {
    this.storage.get('token').then((token) => {
      this.token = token
      this.events.publish('loadItems', '')
    },
    (err) => {
      console.log(err)
      this.token = ''
    })
  }
}
