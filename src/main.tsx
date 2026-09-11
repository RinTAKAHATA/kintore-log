import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { WorkoutProvider } from './context/WorkoutContext'

// GitHub PagesのようなサーバーなしのホスティングだとBrowserRouterは
// 直接/recordなどのURLを開いたりリロードすると404になってしまうため、
// URLが「/#/record」の形になるHashRouterを使う(サーバー側の設定が不要)。
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <WorkoutProvider>
        <App />
      </WorkoutProvider>
    </HashRouter>
  </StrictMode>,
)
