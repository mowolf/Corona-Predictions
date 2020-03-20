<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
        <p>Corona Case Predictions</p>
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #e7e6e9;
}
body {
  margin: 0px !important;
  background-color: #171d2f;
}
#nav {
  padding: 30px;
  background-color: #2c3e50;
  text-align: center;
}

#nav p {
  font-weight: bold;
  padding: 5%;
  color: #e7e6e9;
  font-size: 1.5em;
  text-decoration: none;
  display: inline;
  text-align: center;
}

#nav a {
  font-weight: bold;
  padding: 5%;
  color: #e7e6e9;
  font-size: 1em;
  text-decoration: none;
  display: inline;
}

#nav a.router-link-exact-active {
  color: #b90e1f;
}

/* Tooltip container */

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  left: 30%;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
