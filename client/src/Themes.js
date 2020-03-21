import { createMuiTheme } from "@material-ui/core";


const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: "#006168",
      main: "#006168",
      dark: "#006168"
    },
    secondary: {
      light: "#006168",
      main: "#006168",
      dark: "#006168"
    },
    background: {
      paper: "#524d5d",
      default: "#25222A"
    }
  }
});

export { darkTheme };