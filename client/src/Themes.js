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
      light: "#5a0c68",
      main: "#5a0c68",
      dark: "#5a0c68"
    },
    background: {
      paper: "#524d5d",
      default: "#25222A"
    }
  }
});

export { darkTheme };