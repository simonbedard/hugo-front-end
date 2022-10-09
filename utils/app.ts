import { ThemeManager } from './theme'
import { LanguageManager } from './lang'
import { SearchManager } from './search'
import { APIManager } from './api'

export interface IApp {
  name: string
  author: {
    name: string
    link: string
  }
}
export function AppSetup() {
  // Declare app information
  const app: IApp = {
    name: 'Hugo',
    author: {
      name: 'Simon Bédard',
      link: 'https://www.linkedin.com/in/simon-b%C3%A9dard-968541119/',
    },
  }
  useState('app', () => app)

  
  const apiManager = APIManager();

  // use theme manager
  const themeManager = ThemeManager()

  // use language manager
  const languageManager = LanguageManager()

  // use search manager
  const searchManager = SearchManager();

  // vue transition bug handle
  const messages = [
    `Uncaught NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.`, // chromium based
    `NotFoundError: The object can not be found here.`, // safari
  ]
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (ev) => {
      if (messages.includes(ev.message)) {
        ev.preventDefault()
        window.location.reload()
      }
    })
  }

  // return
  return {
    app,
    themeManager,
    languageManager,
    searchManager,
    apiManager,
  }
}
