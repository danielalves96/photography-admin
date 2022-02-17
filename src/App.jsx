import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { AuthProvider } from './contexts/Auth'
import { Login } from './pages/Login'
import { PrivateRoute } from './components/PrivateRoute'
import "./global.css"

export function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  )
}
