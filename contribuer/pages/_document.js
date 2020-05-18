import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>

        </Head>
        <body>
          <Main />
          <NextScript />
          <footer>
            <p>Dans tous les cas, nous sommes à votre disposition par <a href="mailto:equipe@mes-aides.org&subject=Contribuer">email</a>.</p>
            <p>L'équipe Mes Aides</p>
          </footer>
        </body>
      </Html>
    );
  }
}

export default MyDocument
