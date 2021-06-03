import App from "next/app"
import "../styles/main.css"

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
