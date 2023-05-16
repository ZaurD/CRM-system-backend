import {Injectable} from '@angular/core'
import { Observable } from 'rxjs'
import {tap} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http'

import {User} from '../interfaces'

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private token: string = "";

  constructor(private http: HttpClient) {
  }

  login(user: User): Observable<{token: string}> {
    return this.http.post<{token: string}>('/api/auth/login', user)
      .pipe(tap(({token}) => {
        localStorage.setItem('auth-token', token)
        this.setToken(token)
      }))
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  logout() {
    this.token = ""
    localStorage.clear()
  }

  setToken(token: string) {
    this.token = token
  }

  getToken(): string {
    return this.token
  }
}