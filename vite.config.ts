import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages (https://<ユーザー名>.github.io/kintore-log/) で公開するため、
  // リポジトリ名をbaseに設定する。ここはリポジトリ名を変えたら必ず合わせること。
  base: '/kintore-log/',
})
